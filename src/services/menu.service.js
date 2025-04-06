import pool from "../config/connect";
import CustomError from "../utils/error.utils";
import path from "path";

export default class MenuService {
  async getMenu() {
    const { rows: allMenu, rowCount } = await pool.query("SELECT * FROM menu");

    if (!rowCount) throw new CustomError("Menu not found", 404);

    return allMenu;
  }

  async getMenuById(id) {
    const {
      rows: [menu],
      rowCount,
    } = await pool.query("SELECT * FROM menu WHERE id = $1", [id]);

    if (!rowCount) throw new CustomError("Menu not found", 404);

    return menu;
  }

  async addMenu({ name, description, price, category_id }, image) {
    const { rowCount } = await pool.query(
      "SELECT * FROM menu WHERE name = $1",
      [name]
    );

    if (rowCount) throw new CustomError("Menu already exists", 409);

    const imageUrl = path.join(process.cwd(), "src", "uploads", image.name);

    await image.mv(imageUrl);

    const {
      rows: [newMenu],
    } = await pool.query(
      "INSERT INTO menu(name, description, price, category_id, image_url) VALUES($1, $2, $3, $4, $5) RETURNING name, description, price, category_id",
      [name, description, price, category_id, imageUrl]
    );

    return {
      message: "Menu was added successfully",
      menu: { ...newMenu, image: "/uploads/" + image.name },
    };
  }

  async updateMenu(id, { name, description, price, category_id }, image) {
    const { rowCount } = await pool.query("SELECT * FROM menu WHERE id = $1", [
      id,
    ]);

    if (!rowCount) throw new CustomError("Menu not found", 404);

    const imagePath = path.join(process.cwd(), "src", "uploads", image.name);

    await image.mv(imagePath);

    const {
      rows: [updatedMenu],
    } = await pool.query(
      "UPDATE menu SET name = $1, description = $2, price = $3, category_id = $4, image_url = $5 RETURNING name, description, price, category_id",
      [name, description, price, category_id, imagePath]
    );

    return {
      message: "Menu was updated successfully",
      menu: { ...updatedMenu, image: "/uploads/" + image.name },
    };
  }

  async deleteMenu(id) {
    const { rowCount } = await pool.query("SELECT * FROM menu WHERE id = $1", [
      id,
    ]);

    if (!rowCount) throw new CustomError("Menu not found", 404);

    await pool.query("DELETE FROM menu WHERE id = $1", [id]);

    return {
      message: "Menu was deleted successfully",
    };
  }
}
