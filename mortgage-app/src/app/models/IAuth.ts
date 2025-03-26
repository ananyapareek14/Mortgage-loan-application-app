interface ILogin{
    token: string;
    username: string;
    message: string;
}

interface ILoginCredentials{
    username: string;
    password: string;
}

export type {ILogin as default, ILoginCredentials}