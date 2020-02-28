import * as Yup from 'yup'
import bcrypt from 'bcryptjs'

import User from '../models/User'

class UserController {
  async store(req, res, next) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      lastName: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .min(6)
        .required()
    })

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: 'Validation failed.' })
    }

    const { name, lastName, email, password } = req.body

    const userExists = await User.findOne({ email })

    if (userExists) {
      return res.status(400).json({ error: 'User already exists.' })
    }

    const user = new User({
      name,
      lastName,
      email,
      password: await bcrypt.hash(password, 10)
    })

    user
      .save()
      .then(savedUser => res.json(savedUser))
      .catch(err => next(err))
  }

  async index(req, res) {
    const data = await User.find({})

    return res.json(data)
  }
}

export default new UserController()
