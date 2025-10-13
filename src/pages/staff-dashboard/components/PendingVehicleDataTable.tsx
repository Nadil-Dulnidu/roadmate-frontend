import * as React from "react";
import { DndContext, KeyboardSensor, MouseSensor, TouchSensor, closestCenter, useSensor, useSensors, type UniqueIdentifier } from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  type ColumnDef,
  type ColumnFiltersState,
  type Row,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { CheckCircle2Icon, ColumnsIcon, GripVerticalIcon, LoaderIcon, MoreVerticalIcon, ChevronDownIcon, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { selectAllVehicles, useGetAllVehiclesQuery } from "@/features/vehicle/vehicleSlice";
import { useAppSelector } from "@/app/hook";
import type { FullVehicle } from "@/features/vehicle/vehicleTypes";
import { toast } from "sonner";
import { useAuth } from "@clerk/clerk-react";
import { useUpdateListingStatusMutation } from "@/features/vehicle/vehicleSlice";

function DragHandle({ id }: { id: number }) {
  const { attributes, listeners } = useSortable({ id });

  return (
    <Button {...attributes} {...listeners} variant="ghost" size="icon" className="size-7 text-muted-foreground hover:bg-transparent">
      <GripVerticalIcon className="size-3 text-muted-foreground" />
      <span className="sr-only">Drag to reorder</span>
    </Button>
  );
}

function DraggableRow({ row }: { row: Row<FullVehicle> }) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.original.vehicle_id,
  });

  return (
    <TableRow
      data-state={row.getIsSelected() && "selected"}
      data-dragging={isDragging}
      ref={setNodeRef}
      className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition,
      }}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
      ))}
    </TableRow>
  );
}

export function PendingVehicleDataTable() {
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [showAll, setShowAll] = React.useState(false);
  const { getToken } = useAuth();
  const [updateListingStatus] = useUpdateListingStatusMutation();

  const { isSuccess } = useGetAllVehiclesQuery({ listingStatus: ["PENDING"], vehicleStatus: [] });
  const vehicles = useAppSelector((state) => selectAllVehicles(["PENDING"], [])(state));

  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor), useSensor(KeyboardSensor));

  const visibleData = React.useMemo(() => (showAll ? vehicles : vehicles.slice(0, 4)), [vehicles, showAll]);

  const dataIds = React.useMemo<UniqueIdentifier[]>(() => visibleData?.map(({ vehicle_id }) => vehicle_id) || [], [visibleData]);

  const handleRequest = async (action: "APPROVED" | "CANCELED", vehicleId: number) => {
    try {
      if (!action || !vehicleId) {
        toast.error("Confirmation action and vehicle ID are required");
        throw new Error("Invalid action or vehicle ID");
      }
      const token = await getToken({ template: "RoadMate" });
      await updateListingStatus({ vehicle_id: vehicleId, listing_status: action, token }).unwrap();
      toast.success(`Vehicle ${action === "APPROVED" ? "approved" : "rejected"} successfully`);
    } catch (err) {
      toast.error("Failed to update vehicle status. Please try again.");
      console.error(err);
    }
  };

  const columns: ColumnDef<FullVehicle>[] = [
    {
      id: "drag",
      header: () => null,
      cell: ({ row }) => <DragHandle id={row.original.vehicle_id} />,
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <span>
          {row.original.brand} {row.original.model}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant="outline" className="flex gap-1 px-1.5 text-muted-foreground [&_svg]:size-3 w-fit">
          {row.original.listing_status === "APPROVED" ? <CheckCircle2Icon className="text-green-500 dark:text-green-400" /> : <LoaderIcon />}
          {row.original.listing_status}
        </Badge>
      ),
    },

    {
      accessorKey: "location",
      header: "Location",
      cell: ({ row }) => <span>{row.original.location}</span>,
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => (
        <span>
          {row.original.price_per_day.toLocaleString("en-US", {
            style: "currency",
            currency: "LKR",
          })}
        </span>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex size-8 text-muted-foreground data-[state=open]:bg-muted" size="icon">
              <MoreVerticalIcon />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-32">
            <DropdownMenuItem>
              <Eye />
              View
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleRequest("APPROVED", row.original.vehicle_id)}>
              <CheckCircle2Icon />
              Approve
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleRequest("CANCELED", row.original.vehicle_id)}>
              <LoaderIcon />
              Reject
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const table = useReactTable({
    data: visibleData,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    getRowId: (row) => row.vehicle_id.toString(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  return (
    <div className="flex w-full flex-col justify-start gap-6">
      <div className="flex items-center justify-between px-4 lg:px-6">
        <div className="flex items-center justify-between w-full gap-2">
          <div className="font-semibold text-lg">Recent Listing Requests</div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <ColumnsIcon />
                <span className="hidden lg:inline">Customize Columns</span>
                <span className="lg:hidden">Columns</span>
                <ChevronDownIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {table
                .getAllColumns()
                .filter((column) => typeof column.accessorFn !== "undefined" && column.getCanHide())
                .map((column) => (
                  <DropdownMenuCheckboxItem key={column.id} className="capitalize" checked={column.getIsVisible()} onCheckedChange={(value) => column.toggleVisibility(!!value)}>
                    {column.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6">
        <div className="overflow-hidden rounded-lg border">
          <DndContext collisionDetection={closestCenter} modifiers={[restrictToVerticalAxis]} sensors={sensors}>
            <Table>
              <TableHeader className="sticky top-0 z-10 bg-muted">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id} colSpan={header.colSpan}>
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>

              <TableBody>
                {table.getRowModel().rows.length && isSuccess ? (
                  <SortableContext items={dataIds} strategy={verticalListSortingStrategy}>
                    {table.getRowModel().rows.map((row) => (
                      <DraggableRow key={row.id} row={row} />
                    ))}
                  </SortableContext>
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-20 font-medium text-center">
                      No recent listing requests.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </DndContext>
        </div>
        {vehicles.length > 4 && (
          <div className="flex justify-center">
            <Button variant="outline" size="sm" onClick={() => setShowAll((prev) => !prev)} className="mt-2">
              {showAll ? "Show Less" : `Show All (${vehicles.length})`}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
