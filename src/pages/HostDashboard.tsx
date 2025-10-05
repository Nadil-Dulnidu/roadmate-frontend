import { Button } from "@/components/ui/button";
import AddVehicleModel from "@/features/vehicle/components/AddVehicleModel";
import { useUser } from "@clerk/clerk-react";
import { Upload } from "lucide-react";
import { useState } from "react";

const HostDashboard = () => {
  const { user } = useUser();
  const [isAddMentorModalOpen, setisAddMentorModalOpen] = useState(false);

  return (
    <div className="w-full">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between">
          <div className="mb-4">
            <h2 className="text-2xl font-bold mb-2">Welcome back, {user?.firstName}!</h2>
            <p className="text-muted-foreground">Manage your uploaded vehicles and monitor customer feedback</p>
          </div>
          <div>
            <Button className="flex items-center space-x-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors" onClick={() => setisAddMentorModalOpen(true)}>
              <Upload className="w-4 h-4" />
              <span>Rent Vehicle</span>
            </Button>
          </div>
        </div>
      </main>
      <AddVehicleModel isOpen={isAddMentorModalOpen} onClose={() => setisAddMentorModalOpen(false)} />
    </div>
  );
};

export default HostDashboard;
