"use client";

import React from "react";
import { useRouter } from "next/navigation"; // <-- Next.js router

export default function NotificationDropdown({ onClose }) {
  const router = useRouter(); // <-- replaces useNavigate

  const notifications = [
    {
      id: 1,
      title: "New order received",
      description: "Order #1234 has been placed.",
    },
    {
      id: 2,
      title: "Server Update",
      description: "The server will be updated tonight.",
    },
  ];

  const handleNotificationClick = (id) => {
    onClose();
    // Navigate to notification page (example)
    router.push(`/notifications/${id}`);
  };

  return (
    <div className="absolute right-0 mt-3 w-80 rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden bg-white">
      <ul className="text-sm divide-y">
        {notifications.map((notif) => (
          <li
            key={notif.id}
            className="px-4 py-3 cursor-pointer hover:bg-gray-100 transition"
            onClick={() => handleNotificationClick(notif.id)}
          >
            <p className="font-semibold">{notif.title}</p>
            <p className="text-gray-500">{notif.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
