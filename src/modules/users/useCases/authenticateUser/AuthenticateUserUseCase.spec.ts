
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let usersRepositoryInMemory: IUsersRepository;
let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;

describe("Authenticate User UseCase ", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository()

    authenticateUserUseCase = new AuthenticateUserUseCase(usersRepositoryInMemory)

    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory)
  });

  it('should be able to login', async () => {
    const user: ICreateUserDTO = {
      name: 'userTest',
      email: 'test@test.com',
      password: 'password'
    }

    await createUserUseCase.execute(user)

    const response = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password
    })
    expect(response).toHaveProperty('token')
  })

  it("should not be able to authenticate with a non-existent user", async () => {
    expect(async () => {
      await authenticateUserUseCase.execute({
        email: "non@existent.com",
        password: "non-existent",
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

  it("should not be able to authenticate with a wrong password", async () => {
    expect(async () => {
      const user: ICreateUserDTO = {
        name: "test",
        email: "test@test.com",
        password: "1234",
      }

      await createUserUseCase.execute(user)

      await authenticateUserUseCase.execute({
        email: "test@test.com",
        password: "wrong-password",
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

  it("should not be able to authenticate with a wrong email", async () => {
    expect(async () => {
      const user: ICreateUserDTO = {
        name: "test",
        email: "test@test.com",
        password: "1234",
      }

      await createUserUseCase.execute(user)

      await authenticateUserUseCase.execute({
        email: "non@existent.com",
        password: "1234",
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });
});
