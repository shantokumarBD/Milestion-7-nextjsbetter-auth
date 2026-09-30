"use client";

import { changePassword, updateUser, useSession } from "@/lib/auth-client";
import { FloppyDisk } from "@gravity-ui/icons";
import {
  Button,
  Description,
  FieldError,
  FieldGroup,
  Fieldset,
  Form,
  Input,
  Label,
  TextArea,
  TextField,
} from "@heroui/react";

export default function ProfliePage() {
  const { data: session, isPending } = useSession();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const userData = Object.fromEntries(formData.entries());

    const resData = await updateUser({
      name: userData.name as string,
    });

    if (userData.newPassword && userData.currentPassword) {
      const { data, error } = await changePassword({
        newPassword: userData.newPassword as string,
        currentPassword: userData.currentPassword as string,
        revokeOtherSessions: true,
      });
      if (error) {
        alert("Password change failed: " + error.message);
      } else {
        alert("Password changed successfully!");
      }
    }
  };

  if (isPending) {
    return <div>Loading profile...</div>;
  }

  return (
    <Form className="w-full max-w-96" onSubmit={onSubmit}>
      <Fieldset>
        <Fieldset.Legend>Profile Settings</Fieldset.Legend>
        <Description>Update your profile information.</Description>
        <FieldGroup>
          <TextField
            name="name"
            defaultValue={session?.user?.name ?? ""}
            validate={(value) => {
              if (value.length < 3) {
                return "Name must be at least 3 characters";
              }

              return null;
            }}
          >
            <Label>Name</Label>
            <Input />
            <FieldError />
          </TextField>

          

          <TextField name="currentPassword" type="password">
            <Label>Current Password</Label>
            <Input placeholder="Enter current password" />
            <FieldError />
          </TextField>

          <TextField
            minLength={8}
            name="newPassword"
            type="password"
            validate={(value) => {
              // Only validate if user is trying to change password
              if (value && value.length < 8) {
                return "Password must be at least 8 characters";
              }
              if (value && !/[A-Z]/.test(value)) {
                return "Password must contain at least one uppercase letter";
              }
              if (value && !/[0-9]/.test(value)) {
                return "Password must contain at least one number";
              }
              return null;
            }}
          >
            <Label>New Password</Label>
            <Input placeholder="Enter new password" />
            <Description>
              Must be at least 8 characters with 1 uppercase and 1 number
            </Description>
            <FieldError />
          </TextField>

        </FieldGroup>
        <Fieldset.Actions>
          <Button type="submit">
            <FloppyDisk />
            Save changes
          </Button>
          <Button type="reset" variant="secondary">
            Cancel
          </Button>
        </Fieldset.Actions>
      </Fieldset>
    </Form>
  );
}
