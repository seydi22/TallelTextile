"use client";

import { SectionTitle } from "@/components";

const RegisterPage = () => {
  return (
    <div className="bg-white">
      <SectionTitle title="Register" path="Home | Register" />
      <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8 bg-white">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-2xl font-normal leading-9 tracking-tight text-gray-900">
            Registration is disabled.
          </h2>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;