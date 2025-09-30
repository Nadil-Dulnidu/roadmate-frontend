import { useEffect, useState } from "react";

function timeAgo(date: Date): string {
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const intervals: Record<string, number> = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1,
  };

  for (const key in intervals) {
    const interval = Math.floor(seconds / intervals[key]);
    if (interval >= 1) {
      return `${interval} ${key}${interval > 1 ? "s" : ""} ago`;
    }
  }
  return "just now";
}

interface TimeAgoProps {
  timestamp: string | number | Date;
}

export default function TimeAgo({ timestamp }: TimeAgoProps) {
  const [text, setText] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const date =
        timestamp instanceof Date ? timestamp : new Date(timestamp);
      setText(timeAgo(date));
    };

    updateTime();
    const interval = setInterval(updateTime, 60 * 1000);
    return () => clearInterval(interval);
  }, [timestamp]);

  return <span>{text}</span>;
}
