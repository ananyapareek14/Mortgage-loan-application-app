interface ILogin{
    Token: string;
}

interface ILoginCredentials{
    Username: string;
    Password: string;
}

export type {ILogin as default, ILoginCredentials}