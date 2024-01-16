import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./firebaseConfig";
import {
  Home,
  Blog,
  Contact,
  Messages,
  Portfolio,
  FleaMarketMap,
  EditPortfolio,
  Login,
  Logout,
  Services,
  EditServices,
  EditBlog,
  CreateBlog,
  DeleteBlog,
  DeleteMessages,
  DeletePortfolio,
  CreatePortfolio,
  DeleteServices,
  Footer,
  CreateServices,
  CreateFAQs,
  FAQs,
  AdminPortal,
  Vendor,
  VendorSignUp,
  VendorLogin,
  Events,
  AuthCallback,
  CreateEvents,
  Header
} from "./components";
import "./App.css";

function App() {
  const [darkMode] = useState(false);

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/portfolio" element={<Portfolio darkMode={darkMode} />} />
        <Route path="/editportfolio/:itemId" element={<EditPortfolio />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/services" element={<Services darkMode={darkMode} />} />
        <Route path="/FAQs" element={<FAQs />} />
        <Route path="/VendorSignUp" element={<VendorSignUp />} />
        <Route path="/VendorLogin" element={<VendorLogin />} />
        <Route path="/Vendor/:vendorID" element={<Vendor />} />
        <Route path="/editservice/:serviceId" element={<EditServices />} />
        <Route path="/editblog/:blogId" element={<EditBlog />} />
        <Route path="/createblog" element={<CreateBlog />} />
        <Route path="/auth-callback" element={<AuthCallback />} />
        <Route path="/CreateFAQs" element={<CreateFAQs />} />
        <Route path="/deleteblog/:id" element={<DeleteBlog />} />
        <Route path="/deletemessages/:id" element={<DeleteMessages />} />
        <Route path="/deleteportfolio/:id" element={<DeletePortfolio />} />
        <Route path="/DeleteService/:id" element={<DeleteServices />} />
        <Route path="/createportfolio" element={<CreatePortfolio />} />
        <Route path="/createevents" element={<CreateEvents />} />
        <Route path="/events" element={<Events />} />
        <Route path="/adminportal" element={<AdminPortal />} />
        <Route path="/createservices" element={<CreateServices />} />
        <Route path="/fleamarketmap" element={<FleaMarketMap />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
