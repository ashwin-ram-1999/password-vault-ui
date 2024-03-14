"use client";

import axios, { AxiosError, AxiosResponse } from "axios";
import { ReactNode, useEffect, useState } from "react";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import { Button, TextField } from "@mui/material";

interface Password {
  website: string;
  username: string;
  password: string;
}

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "website", headerName: "Website", width: 200 },
  { field: "username", headerName: "Username", width: 200 },
  {
    field: "password",
    headerName: "Password",
    width: 300,
  },
];

const PasswordVault = (): ReactNode => {
  const [userData, setUserData] = useState<Password>({
    website: "",
    username: "",
    password: "",
  });

  useEffect(() => {
    axios.get("http://localhost:8080/get-all").then((res: AxiosResponse) => {
      sessionStorage.setItem("passwordList", JSON.stringify(res.data));
    });
  }, [userData]);

  const onBlur = (event: any, key: string): void => {
    setUserData((prevData) => ({ ...prevData, [key]: event.target.value }));
  };

  const savePassword = (): void => {
    axios
      .post("http://localhost:8080/save", userData)
      .then((res: AxiosResponse) =>
        alert("API Success Response => " + JSON.stringify(res))
      )
      .catch((err: AxiosError) =>
        alert("API Error Response => " + JSON.stringify(err.response?.data))
      );
  };

  return (
    <div>
      <h1 className="text-4xl text-center mt-2">Password Vault</h1>
      {Object.keys(userData).map((data) => {
        return (
          <TextField
            id="outlined-basic"
            label={data.toLocaleUpperCase()}
            variant="outlined"
            onBlur={(e) => onBlur(e, data)}
          />
        );
      })}
      <Button variant="contained" onClick={() => savePassword()}>
        Contained
      </Button>

      <h1 className="text-4xl text-center mt-2">Saved Passwords</h1>
      <div style={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={JSON.parse(sessionStorage.getItem("passwordList") as any)}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 5 },
            },
          }}
          pageSizeOptions={[5, 10]}
        />
      </div>
    </div>
  );
};

export default PasswordVault;
