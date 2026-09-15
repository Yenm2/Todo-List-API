export interface UserEntity {
    id: string;
    email: string;
    password: string;
    username: string;
    created_at: Date;
}
export class AuthRepository {
    private users: UserEntity[] = [];

async findByEmail(email:string): Promise<UserEntity | null> {
    const user = this.users.find(u => u.email === email);
    return user ?? null
}

async findById(id: string): Promise<UserEntity | null> {
    const user = this.users.find(u => u.id === id);
    return user ?? null;
}

async create(email: string, password: string, username: string): Promise<UserEntity> {
    const newUser: UserEntity = {
        id: crypto.randomUUID(),
        email,
        password: password,
        username: username,
        created_at: new Date(),
    };
    this.users.push(newUser);
    return newUser;
}}