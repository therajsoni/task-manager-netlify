"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { Loader } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

export default function LoginComponent() {
  const [data, setData] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoding] = useState(false);
  async function submitForm() {
    if (data.username === "" || data.password === "") {
      toast.error("Please fill out both field");
      return;
    }
    setLoding(true);
    const req = await fetch("/api/login", {
      method: "POST",
      body: JSON.stringify({
        username: data.username,
        password: data.password,
      }),
      headers: {
        'Content-Type': 'application/json',
      }, credentials: 'include'
    });
    if (req.ok) {
      const res = await req.json();
      if (res?.success) {
        setData({
          username: "",
          password: ""
        });
        toast.success(res.message);
        window.location.reload();
      }
      else {
        toast.error(res?.message);
        setData({
          username: "",
          password: ""
        });
      }
    } else {
      toast.error("Not Logged");
      setData({
        username: "",
        password: ""
      });
    }
    setLoding(false);
  }
  return (
    <div className="fixed flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader>
            <CardTitle>Login to your account</CardTitle>
            <CardDescription>
              Enter your username and password below to login to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div>
              <div className="flex flex-col gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="username">Username**</Label>
                  <Input
                    id="username"
                    type="username"
                    placeholder="Type your Username"
                    required autoComplete="off"
                    autoCorrect="off"
                    spellCheck={false}
                    name="username"
                    onChange={(e) => {
                      e.preventDefault();
                      setData({ ...data, username: e.target.value });
                    }}
                    value={data?.username}
                  />
                </div>
                <div className="grid gap-3">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password**</Label>
                  </div>
                  <Input onPaste={(e) => { e.preventDefault() }} id="password" value={data?.password} type="password" name="password" placeholder="Type your password" required autoComplete="off"
                    autoCorrect="off"
                    spellCheck={false} onChange={(e) => {
                      e.preventDefault();
                      setData({ ...data, password: e.target.value });
                    }} />
                </div>
                <div className="flex flex-col gap-3">
                  <Button className="text-fuchsia-50 bg-amber-400 rounded-2xl hover:bg-amber-400" onClick={() => submitForm()}>
                    {
                      loading ? <Loader  className="animate-spin"  /> : "Login"
                    }
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
