"use client";
import { DashboardSidebar } from "@/components";
import apiClient from "@/lib/api";
import { isValidEmailAddressFormat } from "@/lib/utils";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { sanitizeFormData } from "@/lib/form-sanitize";

const DashboardCreateNewUser = () => {
  const [userInput, setUserInput] = useState<{
    email: string;
    password: string;
    role: string;
  }>({
    email: "",
    password: "",
    role: "user",
  });

  const addNewUser = async () => {
    if (userInput.email === "" || userInput.password === "") {
      toast.error("You must enter all input values to add a user");
      return;
    }

    if (!isValidEmailAddressFormat(userInput.email)) {
      toast.error("You entered invalid email address format");
      return;
    }

    if (userInput.password.length <= 7) {
      toast.error("Password must be longer than 7 characters");
      return;
    }

    try {
      // Sanitize form data before sending to API
      const sanitizedUserInput = sanitizeFormData(userInput);
      
      const response = await apiClient.post(`/api/users`, sanitizedUserInput);

      if (response.status === 201) {
        toast.success("User added successfully");
        setUserInput({
          email: "",
          password: "",
          role: "user",
        });
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Error while creating user");
      }
    } catch (error) {
      toast.error("An unexpected error occurred.");
      console.error("Error creating user:", error);
    }
  };

  return (
    <div className="bg-white flex justify-start max-w-screen-2xl mx-auto xl:h-full max-xl:flex-col max-xl:gap-y-5">
      <DashboardSidebar />
      <div className="flex flex-col gap-y-7 xl:pl-5 max-xl:px-5 w-full">
        <h1 className="text-3xl font-semibold">Add new user</h1>
        <div>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Email:</span>
            </div>
            <input
              type="email"
              className="input input-bordered w-full max-w-xs"
              value={userInput.email}
              onChange={(e) =>
                setUserInput({ ...userInput, email: e.target.value })
              }
            />
          </label>
        </div>

        <div>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Password:</span>
            </div>
            <input
              type="password"
              className="input input-bordered w-full max-w-xs"
              value={userInput.password}
              onChange={(e) =>
                setUserInput({ ...userInput, password: e.target.value })
              }
            />
          </label>
        </div>

        <div>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">User role: </span>
            </div>
            <select
              className="select select-bordered"
              defaultValue={userInput.role}
              onChange={(e) =>
                setUserInput({ ...userInput, role: e.target.value })
              }
            >
              <option value="admin">admin</option>
              <option value="user">user</option>
            </select>
          </label>
        </div>

        <div className="flex gap-x-2">
          <button
            type="button"
            className="uppercase bg-brand-secondary px-10 py-5 text-lg border border-brand-primary font-bold text-white shadow-sm hover:bg-brand-primary hover:text-white focus:outline-none focus:ring-2 focus:ring-brand-primary transition-colors duration-300"
            onClick={addNewUser}
          >
            Create user
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardCreateNewUser;
