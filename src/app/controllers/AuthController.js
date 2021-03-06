import * as Yup from 'yup'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

import authConfig from '../../config/auth'
import User from '../models/User'

class AuthController {
  async store(req, res) {
    const schema = Yup.object().shape({
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

    const { email, password } = req.body

    const user = await User.findOne({ email })

    if (!user) {
      return res.status(401).json({ error: 'User not found.' })
    }

    const hashCompare = await bcrypt.compare(password, user.password)

    if (!hashCompare) {
      return res.status(401).json({ error: 'Password does not match.' })
    }

    const { id, name } = user

    return res.json({
      user: {
        id,
        name,
        email
      },
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expidersIn
      })
    })
  }
}

export default new AuthController()
