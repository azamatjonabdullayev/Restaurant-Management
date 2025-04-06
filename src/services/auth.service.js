import pool from "../config/connect";
import { hashPassword, comparePassword } from "../utils/bcrypt.utils";
import CustomError from "../utils/error.utils";
import { generateToken } from "../utils/jwt.utls";

export default class AuthService {
  static async register({ full_name, email, password, role = null }) {
    const { rows: exists } = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (exists.length > 0) {
      throw new CustomError("Email is already in use", 401);
    }

    const hashedPassword = await hashPassword(password);

    const query = role
      ? {
          text: "INSERT INTO staff (full_name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *",
          values: [full_name, email, hashedPassword, role],
        }
      : {
          text: "INSERT INTO staff (full_name, email, password) VALUES ($1, $2, $3) RETURNING *",
          values: [full_name, email, hashedPassword],
        };

    const { rows: newStaff } = await pool.query(query.text, query.values);

    const token = generateToken({
      id: newStaff[0].id,
      role: newStaff[0].role,
      full_name: newStaff[0].full_name,
      email: newStaff[0].email,
    });

    return { token, newEmployee: newStaff[0] };
  }

  static async login({ email, password }) {
    const { rows } = await pool.query("SELECT * FROM staff WHERE email = $1", [
      email,
    ]);

    if (rows.length === 0) {
      throw new CustomError("Invalid email or password", 401);
    }

    const user = rows[0];

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      throw new CustomError("Invalid email or password", 401);
    }

    const token = generateToken({
      id: user.id,
      role: user.role,
      full_name: user.full_name,
      email: user.email,
    });

    const { password: _, ...safeUser } = user;

    return { token, user: safeUser };
  }
}
