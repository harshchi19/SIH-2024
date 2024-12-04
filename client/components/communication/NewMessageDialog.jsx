// import React, { useEffect, useState } from "react";
// import { useDebounce } from "use-debounce";
// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Avatar, AvatarFallback } from "@/components/ui/avatar";
// import { PlusCircle } from "lucide-react";
// import { GET_CONTACTS } from "@/utils/constants";
// import { Input } from "../ui/input";

// const NewMessageDialog = ({ onAddContact }) => {
//   const [open, setOpen] = useState(false);
//   const [search, setSearch] = useState("");
//   const [contacts, setContacts] = useState({
//     patients: [],
//     supervisors: [],
//     therapists: [],
//   });
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchContacts = async () => {
//       setIsLoading(true);
//       setError(null);

//       const userId = localStorage.getItem("user");
//       try {
//         const response = await fetch(`${GET_CONTACTS}/${userId}`, {
//           method: "GET",
//           headers: { "Content-Type": "application/json" },
//         });

//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }

//         const result = await response.json();
//         setContacts(result.contacts);
//       } catch (error) {
//         setError(error.message || "Failed to fetch contacts");
//         setContacts({ patients: [], supervisors: [], therapists: [] });
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchContacts();
//   }, []);

//   // Combine all contact types (patients, supervisors, therapists) into a single list
//   const contactsList = [
//     ...contacts.patients.map((contact) => ({
//       id: contact.patient_id,
//       name: contact.name,
//       type: "Patient",
//     })),
//     ...contacts.supervisors.map((contact) => ({
//       id: contact.supervisor_id,
//       name: contact.name,
//       type: "Supervisor",
//     })),
//     ...contacts.therapists.map((contact) => ({
//       id: contact.student_therapist_id,
//       name: contact.name,
//       type: "Student Therapist",
//     })),
//   ];

//   // Filter contacts based on search query
//   const [debouncedSearch] = useDebounce(search, 300); // 300ms delay
//   const filteredContacts = contactsList.filter((contact) =>
//     contact.name.toLowerCase().includes(debouncedSearch.toLowerCase())
//   );

//   const handleSelectContact = (contact) => {
//     onAddContact({
//       id: contact.id,
//       name: contact.name,
//       lastMessage: "New conversation",
//       time: "Just now",
//       unread: true,
//       type: contact.type,
//     });
//     setOpen(false);
//     setSearch("");
//   };

//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogTrigger asChild>
//         <Button className="w-full mb-4 gap-2">
//           <PlusCircle className="w-4 h-4" />
//           New Message
//         </Button>
//       </DialogTrigger>
//       <DialogContent className="sm:max-w-[425px]">
//         <DialogHeader>
//           <DialogTitle>New Message</DialogTitle>
//         </DialogHeader>
//         <div className="rounded-lg border shadow-md">
//           <div className="flex items-center gap-2 p-2">
//             <Input
//               placeholder="Search Contacts"
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//             />
//           </div>
//           {isLoading ? (
//             <div className="p-4 text-center text-gray-500">
//               Loading contacts...
//             </div>
//           ) : error ? (
//             <div className="p-4 text-center text-red-500">
//               Error loading contacts
//             </div>
//           ) : filteredContacts.length === 0 ? (
//             <div className="p-4 text-center text-gray-500">
//               No contacts found.
//             </div>
//           ) : (
//             <div className="max-h-[300px] overflow-auto">
//               {filteredContacts.map((contact) => (
//                 <div
//                   key={contact.id}
//                   onClick={() => handleSelectContact(contact)}
//                   className="flex items-center gap-3 p-2 cursor-pointer hover:bg-gray-100"
//                 >
//                   <Avatar className="h-10 w-10">
//                     <AvatarFallback>
//                       {contact.name
//                         .split(" ")
//                         .map((n) => n[0])
//                         .join("")
//                         .toUpperCase()}
//                     </AvatarFallback>
//                   </Avatar>
//                   <div className="flex flex-col">
//                     <span className="font-medium">{contact.name}</span>
//                     <span className="text-sm text-gray-500">
//                       {contact.type}
//                     </span>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default NewMessageDialog;

import React, { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { PlusCircle } from "lucide-react";
import { GET_CONTACTS_ROUTE } from "@/utils/constants";
import { Input } from "../ui/input";

const NewMessageDialog = ({ onAddContact }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [contacts, setContacts] = useState({
    patients: [],
    supervisors: [],
    therapists: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContacts = async () => {
      setIsLoading(true);
      setError(null);

      const userId = localStorage.getItem("user");
      try {
        const response = await fetch(`${GET_CONTACTS_ROUTE}/${userId}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        // console.log("Contacts fetched:", result.contacts);
        setContacts({
          patients: result.contacts?.patients || [],
          supervisors: result.contacts?.supervisors || [],
          therapists: result.contacts?.therapists || [],
        });
      } catch (error) {
        setError(error.message || "Failed to fetch contacts");
        setContacts({ patients: [], supervisors: [], therapists: [] });
      } finally {
        setIsLoading(false);
      }
    };

    fetchContacts();
  }, []);

  const contactsList = [
    ...contacts.patients.map((contact) => ({
      id: contact.patient_id,
      name: contact.name,
      type: "Patient",
    })),
    ...contacts.supervisors.map((contact) => ({
      id: contact.supervisor_id,
      name: contact.name,
      type: "Supervisor",
    })),
    ...contacts.therapists.map((contact) => ({
      id: contact.student_therapist_id,
      name: contact.name,
      type: "Student Therapist",
    })),
  ];

  const [debouncedSearch] = useDebounce(search, 300); // 300ms delay
  const filteredContacts = contactsList.filter((contact) =>
    contact.name.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  const handleSelectContact = (contact) => {
    onAddContact({
      id: contact.id,
      name: contact.name,
      lastMessage: "New conversation",
      time: "Just now",
      unread: true,
      type: contact.type,
    });
    setOpen(false);
    setSearch("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full mb-4 gap-2">
          <PlusCircle className="w-4 h-4" />
          New Message
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New Message</DialogTitle>
        </DialogHeader>
        <div className="rounded-lg border shadow-md">
          <div className="flex items-center gap-2 p-2">
            <Input
              placeholder="Search Contacts"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">
              Loading contacts...
            </div>
          ) : error ? (
            <div className="p-4 text-center text-red-500">
              Error loading contacts
            </div>
          ) : filteredContacts.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No contacts found.
            </div>
          ) : (
            <div className="max-h-[300px] overflow-auto">
              {filteredContacts.map((contact) => (
                <div
                  key={contact.id}
                  onClick={() => handleSelectContact(contact)}
                  className="flex items-center gap-3 p-2 cursor-pointer hover:bg-gray-100"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>
                      {contact.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-medium">{contact.name}</span>
                    <span className="text-sm text-gray-500">
                      {contact.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewMessageDialog;
