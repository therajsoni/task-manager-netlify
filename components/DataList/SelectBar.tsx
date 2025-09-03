"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Loader } from "lucide-react";
import Select from "react-select";
import toast from "react-hot-toast";
import UsersTable from "./UsersTable";
import { ClickProject, singleProjectType } from "@/types";
import { SingleValue } from "react-select";

interface userType {
  _id: string;
  username: string;
}

export default function SelectInputBar({
  clickProjectData,
}: {
  clickProjectData: ClickProject;
}) {
  const [groupList, setGroupList] = useState<string[]>([]); // already in group
  const [options, setOptions] = useState<{ label: string; value: string }[]>(
    []
  );
  const [valSelect, setValSelect] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const [onDelete, setOnDelete] = useState<number>(0);
  const [usersLoading, setUsersLoading] = useState(false);
  const fetchAllLoginUsers = useCallback(async () => {
    setUsersLoading(true);
    const request = await fetch("/api/getAllUser", {
      method: "GET",
      cache: "no-store",
    });
    if (request.ok) {
      const response = await request.json();
      if (response?.success) {
        const allLoginUsers = response?.data;

        const alreadyGroupMembers: string[] =
          clickProjectData?.group?.map(
            (item: { member: string }) => item.member
          ) || [];
        setGroupList(alreadyGroupMembers);

        const nonGroupMembers = allLoginUsers
          .filter(
            (user: userType) => !alreadyGroupMembers.includes(user.username)
          )
          .map((user: userType) => user.username);

        const formattedOptions = nonGroupMembers.map((username: string) => ({
          label: username,
          value: username,
        }));
        setOptions(formattedOptions);
      }
    }
    setUsersLoading(false);
  }, [clickProjectData?.group]);

  useEffect(() => {
    if (clickProjectData?._id) {
      fetchAllLoginUsers();
    }
  }, [clickProjectData, onDelete, fetchAllLoginUsers]);

  const handleChange = (
    selectedOption: SingleValue<{
      label: string;
      value: string;
    }>
  ) => {
    setValSelect(selectedOption?.value || "");
  };

  const updateGroupChange = async (val: string) => {
    if (!val) return toast.error("Please select a user");

    setLoading(true);
    const request = await fetch(
      `/api/project/create-project-team/${clickProjectData?._id}`,
      {
        method: "POST",
        body: JSON.stringify({ team: [val], id: clickProjectData?._id }),
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      }
    );

    if (request.ok) {
      const response = await request.json();
      if (response?.success) {
        toast.success("User added to group");
        setGroupList((prev) => [...prev, val]);
        setOptions((prev) => prev.filter((opt) => opt.value !== val));
        setValSelect("");
        await fetchProjectData();
      } else {
        toast.error("Failed to add user");
      }
    } else {
      toast.error("Something went wrong");
    }
    setLoading(false);
  };

  const fetchProjectData = useCallback(async () => {
    try {
      const request = await fetch(
        `/api/project/getId/${clickProjectData?._id}`,
        {
          method: "POST",
          cache: "no-store",
          body: JSON.stringify({
            id: clickProjectData?._id,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (request.ok) {
        const response = await request.json();
        if (response.success) {
          const members =
            response.data[0]?.group?.map(
              (item: { member: string }) => item.member
            ) || [];
          setGroupList(members);
        }
      }
    } catch (error) {
      toast.error("fetch project data in error occured");
    }
  }, [clickProjectData?._id]);

  useEffect(() => {
    if (clickProjectData?._id) {
      fetchProjectData();
    }
  }, []);
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Select
          options={
            usersLoading
              ? [{ label: "Loading Please Wait...", value: "loading" }]
              : options
          }
          onChange={handleChange}
          isSearchable={true}
          placeholder="Select or type..."
          className="w-full"
          value={options.find((option) => option.value === valSelect) || null}
        />
        <Button
          variant="link"
          onClick={() => updateGroupChange(valSelect)}
          className="bg-gray-900 text-white h-10"
        >
          {loading ? <Loader className="animate-spin" /> : "ADD"}
        </Button>
      </div>
      <UsersTable
        onUpdateOptions={fetchAllLoginUsers}
        clickProjectData={clickProjectData}
        groupList={groupList}
        setOnDelete={setOnDelete}
        onRefetch={fetchProjectData}
      />
    </div>
  );
}
