import jwt from 'jsonwebtoken'
import { JwtAdapter } from './jwt-adapter'

jest.mock('jsonwebtoken', () => ({
  sign: async () => {
    return await new Promise((resolve) => { resolve('accessToken') })
  }
}))

describe('Jwt Adapter', () => {
  test('Should call jwt sign with correct values', async () => {
    const sut = new JwtAdapter('secret')
    const signSpy = jest.spyOn(jwt, 'sign')
    await sut.encrypt('any_id')
    expect(signSpy).toHaveBeenCalledWith({ id: 'any_id' }, 'secret')
  })

  test('Should return an accessToken on success', async () => {
    const sut = new JwtAdapter('secret')
    const accessToken = await sut.encrypt('secret')
    expect(accessToken).toBe('accessToken')
  })

  test('Should throw if Jwt throws', async () => {
    const sut = new JwtAdapter('secret')
    jest.spyOn(jwt, 'sign').mockImplementationOnce(async () => {
      await new Promise((resolve, reject) => { reject(new Error()) })
    })
    const promise = sut.encrypt('any_id')
    await expect(promise).rejects.toThrow()
  })
})
