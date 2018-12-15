export interface User {
    id: number;
    username:string;
    knownAs: string;
    age:number;
    gender:string;
    created:Date;
    lastActive:Date;
    photoUrl:string;
    city:string;
    country:string;
    interests?: string;
    introduction?: string;
    lookingFor?:string;
    photos?:Photo[];
    confirmPassword?: string;
    password?:string
}

export interface Photo {
    id: number;
    url:string;
    description:string;
    dateAdded:Date;
    mainPhoto:boolean;
}