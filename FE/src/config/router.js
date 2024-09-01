import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../jsx/pages/authentication/Login";
import SignUp from "../jsx/pages/authentication/Registration";
// import Login from "../jsx/pages/authentication/Test";
import { AuthProvider, RequireAuth } from "react-auth-kit";
import Home from "../jsx/pages/user/Home";
import ProfileEdit from "../jsx/pages/user/editProfile";
import Account from "../jsx/pages/user/Account";
import Dashboard from "../jsx/pages/user/Dashboard";
import Market from "../jsx/pages/user/Market";
import Error404 from "../jsx/pages/error/Error404";
import Documents from "../jsx/pages/user/Documents";
import Assets from "../jsx/pages/user/Asssets";
import StakingPg from "../jsx/pages/user/Staking";
import Swappg from "../jsx/pages/user/Swap";
import Transactions from "../jsx/pages/user/Transactions";
import Supportpg from "../jsx/pages/user/Support";
import Kyc from "../jsx/pages/user/Kyc";
import UserVerifications from "../jsx/Admin/SingleUser/UserVerificatons";
import AdminDashboard from "../jsx/Admin/Dashboard";
import PendingTransactions from "../jsx/Admin/pendingTransactions";
import AdminTickets from "../jsx/Admin/AdminTicktes";
import AdminUsers from "../jsx/Admin/AdminUsers";
import General from "../jsx/Admin/SingleUser/Generalmain.js";
import UserAssets from "../jsx/Admin/SingleUser/UserAssets";
import UserTransactions from "../jsx/Admin/SingleUser/UserTransactions";
import AdminProfile from "../jsx/Admin/adminProfile";
import FileUpload from "../jsx/Admin/fileUpload";
import AddUser from "../jsx/Admin/AddUser";
import UserDocs from "../jsx/Admin/SingleUser/UserDocs";
export default function Router() {
  return (
    <AuthProvider authType={"localstorage"} authName={"auth"}>
      <BrowserRouter>
        <Routes>
          <Route index path="/" element={<Home />} />{" "}
          <Route path="auth/login" element={<Login />} />{" "}
          <Route path="/auth/signup" element={<SignUp />} />
          <Route
            path="/dashboard"
            element={
              <RequireAuth loginPath={"/auth/login"}>
                <Dashboard />
              </RequireAuth>
            }
          />
          <Route
            path="/market"
            element={
              <RequireAuth loginPath={"/auth/login"}>
                <Market />
              </RequireAuth>
            }
          />
          <Route
            path="/edit-profile"
            element={
              <RequireAuth loginPath={"/auth/login"}>
                <ProfileEdit />
              </RequireAuth>
            }
          />
          <Route
            path="/all-files"
            element={
              <RequireAuth loginPath={"/auth/login"}>
                <Documents />
              </RequireAuth>
            }
          />
          <Route
            path="/assets"
            element={
              <RequireAuth loginPath={"/auth/login"}>
                <Assets />
              </RequireAuth>
            }
          />
          <Route
            path="/account"
            element={
              <RequireAuth loginPath={"/auth/login"}>
                <Account />
              </RequireAuth>
            }
          />
          <Route
            path="/staking"
            element={
              <RequireAuth loginPath={"/auth/login"}>
                <StakingPg />
              </RequireAuth>
            }
          />
          <Route
            path="/swap"
            element={
              <RequireAuth loginPath={"/auth/login"}>
                <Swappg />
              </RequireAuth>
            }
          />
          <Route
            path="/Transactions/:id"
            element={
              <RequireAuth loginPath={"/auth/login"}>
                <Transactions />
              </RequireAuth>
            }
          />
          <Route
            path="/support"
            element={
              <RequireAuth loginPath={"/auth/login"}>
                <Supportpg />
              </RequireAuth>
            }
          />
          <Route
            path="/flows/kyc"
            element={
              <RequireAuth loginPath={"/auth/login"}>
                <Kyc />
              </RequireAuth>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <RequireAuth loginPath={"/auth/login"}>
                <AdminDashboard />
              </RequireAuth>
            }
          />
          {/* <Route
            path="/admin/upload-files"
            element={
              <RequireAuth loginPath={"/auth/login"}>
                <FileUpload />
              </RequireAuth>
            }
          /> */}
          <Route
            path="/admin/transactions/pending"
            element={
              <RequireAuth loginPath={"/auth/login"}>
                <PendingTransactions />
              </RequireAuth>
            }
          />
          <Route
            path="/admin/tickets"
            element={
              <RequireAuth loginPath={"/auth/login"}>
                <AdminTickets />
              </RequireAuth>
            }
          />
          <Route
            path="/admin/profile"
            element={
              <RequireAuth loginPath={"/auth/login"}>
                <AdminProfile />
              </RequireAuth>
            }
          />
          <Route
            path="/admin/add-user"
            element={
              <RequireAuth loginPath={"/auth/login"}>
                <AddUser />
              </RequireAuth>
            }
          />

          <Route
            path="/admin/users"
            element={
              <RequireAuth loginPath={"/auth/login"}>
                <AdminUsers />
              </RequireAuth>
            }
          />
          <Route
            path="/admin/users/:id/general"
            element={
              <RequireAuth loginPath={"/auth/login"}>
                <General />
              </RequireAuth>
            }
          />
          <Route
            path="/admin/users/:id/documents"
            element={
              <RequireAuth loginPath={"/auth/login"}>
                <UserDocs />
              </RequireAuth>
            }
          />
          <Route
            path="/admin/users/:id/assets"
            element={
              <RequireAuth loginPath={"/auth/login"}>
                <UserAssets />
              </RequireAuth>
            }
          />
          <Route
            path="/admin/users/:id/transactions"
            element={
              <RequireAuth loginPath={"/auth/login"}>
                <UserTransactions />
              </RequireAuth>
            }
          />
          <Route
            path="/admin/users/:id/verifications"
            element={
              <RequireAuth loginPath={"/auth/login"}>
                <UserVerifications />
              </RequireAuth>
            }
          />
          <Route path="*" element={<Error404 />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
