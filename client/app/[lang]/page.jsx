// "use client";
// import React, { useState } from "react";
// import Image from "next/image";
// import { useRouter } from "next/navigation";
// import { logo, landingIllustration } from "@/assets";
// import { Button } from "@/components/ui/button";
// import { Stories } from "@/components/landingpage/stories";

// const Navbar = ({ setActivePage }) => {
//   const navItems = [
//     { label: "Home", href: "/en" },
//     { label: "Vani.ai", href: "/vani-ai" },
//     { label: "Stories", href: "Stories" }, // Changed href to match dynamic routing
//     { label: "Navigation", href: "/navigation" },
//   ];

//   return (
//     <nav className="flex space-x-9 items-center">
//       {navItems.map((item) => (
//         <button
//           key={item.label}
//           onClick={() => setActivePage(item.href)}
//           className="text-green-800 hover:text-green-950 transition-colors duration-300 font-medium"
//         >
//           {item.label}
//         </button>
//       ))}
//     </nav>
//   );
// };

// const LandingPage = () => {
//   const router = useRouter();
//   const [activePage, setActivePage] = useState("home"); // Tracks the active page

//   const handleLogin = () => {
//     router.push("/en/sign-in");
//   };

//   // Conditional Rendering of Content
//   const renderContent = () => {
//     switch (activePage) {
//       case "stories":
//         return <stories />;
//       case "/en":
//       default:
//         return (
//           <div className="m-12 px-20 flex-1 justify-between flex gap-30 items-center relative z-10">
//             <div className="">
//               <h1 className="text-[45px] text-green-950 font-bold">
//                 Vani Vikas
//               </h1>
//               <h3 className="text-green-700 text-xl">
//                 Empowering Voices, Enabling Progress.
//               </h3>
//               <Button
//                 className="h-16 text-xl w-30 mt-5 bg-green-500 border-none text-white hover:bg-green-600 px-6 py-2 rounded-md"
//                 onClick={handleLogin}
//               >
//                 Login
//               </Button>
//             </div>

//             <Image
//               src={landingIllustration}
//               width={800}
//               height={800}
//               alt="landing graphic"
//             />
//           </div>
//         );
//     }
//   };

//   return (
//     <div className="bg-green-100 min-h-screen flex flex-col relative overflow-hidden">
//       <div className="flex justify-between items-center px-8 py-4">
//         <Image src={logo} alt="logo" width={80} height={80} />
//         <Navbar setActivePage={setActivePage} />
//       </div>
//       <div className="flex-1">{renderContent()}</div>
//       <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] bg-green-400 rounded-full -z-10"></div>
//       <div className="bg-green-400 flex-1"></div>
//     </div>
//   );
// };

// export default LandingPage;

"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { logo, landingIllustration } from "@/assets";
import { Button } from "@/components/ui/button";
import Stories from "@/components/landingpage/stories"; // Import your SpeechTherapyCards component

const Navbar = ({ setActivePage }) => {
  const navItems = [
    { label: "Home", page: "home" },
    { label: "Vani.ai", page: "vani-ai" },
    { label: "Stories", page: "stories" },
    { label: "Navigation", page: "navigation" },
  ];

  return (
    <nav className="flex space-x-9 items-center">
      {navItems.map((item) => (
        <button
          key={item.label}
          onClick={() => setActivePage(item.page)}
          className="text-green-800 hover:text-green-950 transition-colors duration-300 font-medium"
        >
          {item.label}
        </button>
      ))}
    </nav>
  );
};

const LandingPage = () => {
  const router = useRouter();
  const [activePage, setActivePage] = useState("home"); // Tracks the active page

  const handleLogin = () => {
    router.push("/en/sign-in");
  };

  // Conditional Rendering of Content
  const renderContent = () => {
    switch (activePage) {
      case "stories":
        return <Stories />; // Render SpeechTherapyCards component when "Stories" is selected
      case "home":
      default:
        return (
          <div className="m-12 px-20 flex-1 justify-between flex gap-30 items-center relative z-10">
            <div className="">
              <h1 className="text-[45px] text-green-950 font-bold">
                Vani Vikas
              </h1>
              <h3 className="text-green-700 text-xl">
                Empowering Voices, Enabling Progress.
              </h3>
              <Button
                className="h-16 text-xl w-30 mt-5 bg-green-500 border-none text-white hover:bg-green-600 px-6 py-2 rounded-md"
                onClick={handleLogin}
              >
                Login
              </Button>
            </div>

            <Image
              src={landingIllustration}
              width={800}
              height={800}
              alt="landing graphic"
            />
          </div>
        );
    }
  };

  return (
    <div className="bg-green-100 min-h-screen flex flex-col relative overflow-hidden">
      <div className="flex justify-between items-center px-8 py-4">
        <Image src={logo} alt="logo" width={80} height={80} />
        <Navbar setActivePage={setActivePage} />
      </div>
      <div className="flex-1">{renderContent()}</div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] bg-green-400 rounded-full -z-10"></div>
      <div className="bg-green-400 flex-1"></div>
    </div>
  );
};

export default LandingPage;
