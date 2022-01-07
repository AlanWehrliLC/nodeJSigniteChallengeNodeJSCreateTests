import { CreateUserUseCase } from './CreateUserUseCase'
import { InMemoryUsersRepository } from '../../repositories/in-memory/InMemoryUsersRepository'
import { AppError } from '../../../../shared/errors/AppError';


let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe("Create User UserCase ", () => {


  beforeEach(async () => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
  })

  it("Should be able to create a new user", async () => {
    let user = {
      name: 'testSample',
      email: 'test@test.com',
      password: 'test'
    }
    await createUserUseCase.execute({
      name: user.name,
      email: user.email,
      password: user.password,
    })

    const userCreated = await inMemoryUsersRepository.findByEmail(user.email)
    expect(userCreated).toHaveProperty('id');
  })

  it("Should not be able to create a new user with an existing email", async () => {
    expect(async () => {
      let user = {
        name: 'testSample',
        email: 'test@test.com',
        password: 'test'
      }
      await createUserUseCase.execute({
        name: user.name,
        email: user.email,
        password: user.password,
      })
      await createUserUseCase.execute({
        name: user.name,
        email: user.email,
        password: user.password,
      })
    }).rejects.toBeInstanceOf(AppError)
  })
})
