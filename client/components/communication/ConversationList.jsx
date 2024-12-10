// import React, { useEffect, useState } from "react";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Avatar, AvatarFallback } from "@/components/ui/avatar";
// import { GET_CONTACTS_ROUTE } from "@/utils/constants";

// const ConversationList = ({ onSelectContact, selectedId }) => {
//   const [contacts, setContacts] = useState({
//     patients: [],
//     supervisors: [],
//     therapists: [],
//   });
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);

//   // Fetch contacts when the component mounts
//   useEffect(() => {
//     const fetchContacts = async () => {
//       setIsLoading(true);
//       setError(null);

//       const userId = localStorage.getItem("user"); // Get the user ID from localStorage
//       try {
//         const response = await fetch(`${GET_CONTACTS_ROUTE}/${userId}`, {
//           method: "GET",
//           headers: { "Content-Type": "application/json" },
//         });

//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }

//         const result = await response.json();
//         // console.log(result.contacts);
//         // Group contacts by type
//         setContacts({
//           patients: result.contacts?.patients || [],
//           supervisors: result.contacts?.supervisors || [],
//           therapists: result.contacts?.therapists || [],
//         });
//       } catch (error) {
//         setError(error.message || "Failed to fetch contacts");
//         setContacts({ patients: [], supervisors: [], therapists: [] });
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchContacts();
//   }, []);

//   const handleClick = (contact) => {
//     // Determine the correct ID to pass back
//     const contactId =
//       contact.student_therapist_id ||
//       contact.supervisor_id ||
//       contact.patient_id ||
//       contact.id;

//     onSelectContact(contact);
//   };

//   // Render section with conversations - now uses original UI grouping
//   const renderSection = (title, contactsList) => {
//     if (contactsList.length === 0) return null;

//     return (
//       <div className="mb-4">
//         <h3 className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
//           {title}
//         </h3>
//         {contactsList.map((contact) => {
//           // Determine the contact's unique identifier
//           const contactId =
//             contact.student_therapist_id ||
//             contact.supervisor_id ||
//             contact.patient_id ||
//             contact.id;

//           // Check if this contact is selected
//           const isSelected = selectedId === contactId;

//           return (
//             <div
//               key={contactId}
//               onClick={() => handleClick(contact)}
//               className={`
//                 flex items-center gap-3 p-3 cursor-pointer
//                 hover:bg-gray-100 rounded-lg
//                 mb-2 // Added margin between contacts
//                 transition-all duration-200 ease-in-out
//                 ${
//                   isSelected
//                     ? "bg-blue-100 border-l-4 border-blue-500 shadow-sm text-blue-700"
//                     : "bg-white text-gray-800"
//                 }
//               `}
//             >
//               <Avatar className="h-12 w-12">
//                 <AvatarFallback>
//                   {contact.name
//                     .split(" ")
//                     .map((n) => n[0])
//                     .join("")
//                     .toUpperCase()}
//                 </AvatarFallback>
//               </Avatar>
//               <div className="flex-1 min-w-0">
//                 <div className="flex items-center justify-between">
//                   <span className="font-medium">{contact.name}</span>
//                   <span className="text-xs text-gray-500">{contact.time}</span>
//                 </div>
//                 <p className="text-sm text-gray-500 truncate">
//                   {contact.lastMessage}
//                 </p>
//               </div>
//               {contact.unread && (
//                 <div className="w-2 h-2 bg-[#68B984] rounded-full"></div>
//               )}
//             </div>
//           );
//         })}
//       </div>
//     );
//   };

//   if (isLoading) {
//     return <div className="text-center p-4">Loading...</div>;
//   }

//   if (error) {
//     return <div className="text-center p-4 text-red-500">{error}</div>;
//   }

//   return (
//     <ScrollArea className="flex-1">
//       {renderSection("Student Therapists", contacts.therapists)}
//       {renderSection("Supervisors", contacts.supervisors)}
//       {renderSection("Patients", contacts.patients)}

//       {/* Show message if no contacts */}
//       {contacts.patients.length === 0 &&
//         contacts.supervisors.length === 0 &&
//         contacts.therapists.length === 0 && (
//           <div className="text-center text-gray-500 p-4">
//             No conversations yet
//           </div>
//         )}
//     </ScrollArea>
//   );
// };

// export default ConversationList;

import React, { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { GET_CONTACTS_ROUTE, GET_MESSAGES_ROUTE } from "@/utils/constants";
import moment from "moment";

const ConversationList = ({ onSelectContact, selectedId }) => {
  const [contacts, setContacts] = useState({
    patients: [],
    supervisors: [],
    therapists: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch recent messages for each contact
  const fetchRecentMessages = async (userId, contacts) => {
    const updatedContacts = await Promise.all(
      Object.entries(contacts).map(async ([type, contactList]) => {
        const updatedList = await Promise.all(
          contactList.map(async (contact) => {
            const contactId =
              contact.student_therapist_id ||
              contact.supervisor_id ||
              contact.patient_id ||
              contact.id;

            try {
              const response = await fetch(
                `${GET_MESSAGES_ROUTE}/${userId}/${contactId}`,
                {
                  method: "GET",
                  headers: { "Content-Type": "application/json" },
                }
              );

              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
              }

              const result = await response.json();
              const messages = result.messages || [];

              // Get the most recent message
              const mostRecentMessage =
                messages.length > 0 ? messages[messages.length - 1] : null;

              return {
                ...contact,
                lastMessage: mostRecentMessage
                  ? mostRecentMessage.content
                  : "Start a conversation",
                time: mostRecentMessage
                  ? moment(mostRecentMessage.timestamp).format("h:mm A")
                  : "",
                unread: false, // You can implement unread logic later
                messageCount: messages.length,
              };
            } catch (error) {
              console.error(`Error fetching messages for ${contactId}:`, error);
              return {
                ...contact,
                lastMessage: "Start a conversation",
                time: "",
                unread: false,
                messageCount: 0,
              };
            }
          })
        );
        return [type, updatedList];
      })
    );

    return Object.fromEntries(updatedContacts);
  };

  // Fetch contacts when the component mounts
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
        const initialContacts = {
          patients: result.contacts?.patients || [],
          supervisors: result.contacts?.supervisors || [],
          therapists: result.contacts?.therapists || [],
        };

        // Fetch recent messages for each contact
        const contactsWithMessages = await fetchRecentMessages(
          userId,
          initialContacts
        );

        setContacts(contactsWithMessages);
      } catch (error) {
        setError(error.message || "Failed to fetch contacts");
        setContacts({ patients: [], supervisors: [], therapists: [] });
      } finally {
        setIsLoading(false);
      }
    };

    fetchContacts();
  }, []);

  const handleClick = (contact) => {
    const contactId =
      contact.student_therapist_id ||
      contact.supervisor_id ||
      contact.patient_id ||
      contact.id;

    onSelectContact(contact);
  };

  // Render section with conversations
  const renderSection = (title, contactsList) => {
    if (contactsList.length === 0) return null;

    return (
      <div className="mb-4">
        <h3 className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          {title}
        </h3>
        {contactsList.map((contact) => {
          const contactId =
            contact.student_therapist_id ||
            contact.supervisor_id ||
            contact.patient_id ||
            contact.id;

          const isSelected = selectedId === contactId;

          return (
            <div
              key={contactId}
              onClick={() => handleClick(contact)}
              className={`
                flex items-center gap-3 p-3 cursor-pointer 
                hover:bg-gray-100 rounded-lg 
                mb-2 
                transition-all duration-200 ease-in-out
                ${
                  isSelected
                    ? "bg-blue-100 border-l-4 border-blue-500 shadow-sm text-blue-700"
                    : "bg-white text-gray-800"
                }
              `}
            >
              <Avatar className="h-12 w-12">
                <AvatarFallback>
                  {contact.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{contact.name}</span>
                  <span className="text-xs text-gray-500">{contact.time}</span>
                </div>
                <p className="text-sm text-gray-500 truncate">
                  {contact.messageCount > 0
                    ? contact.lastMessage
                    : "Start a conversation"}
                </p>
              </div>
              {contact.unread && (
                <div className="w-2 h-2 bg-[#68B984] rounded-full"></div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  if (isLoading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-center p-4 text-red-500">{error}</div>;
  }

  return (
    <ScrollArea className="flex-1">
      {renderSection("Student Therapists", contacts.therapists)}
      {renderSection("Supervisors", contacts.supervisors)}
      {renderSection("Patients", contacts.patients)}

      {contacts.patients.length === 0 &&
        contacts.supervisors.length === 0 &&
        contacts.therapists.length === 0 && (
          <div className="text-center text-gray-500 p-4">
            No conversations yet
          </div>
        )}
    </ScrollArea>
  );
};

export default ConversationList;
