export interface RegisterUser{
    name:string 
    email:string 
    password:string
}

export interface LoginUser{
    email:string 
    password:string
}

export interface LoggedUser{
    email:string 
    name:string 
    created_at:string 
    id:number
    image?:string
}

export interface ChangePasswordUser{
     old_password: string;
    new_password: string;
    confirm_password: string;
}