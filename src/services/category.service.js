import pool from "../config/connect";
import CustomError from "../utils/error.utils";

export default class CategoryService {
  async getCategories() {
    const { rows: allCategories, rowCount } = await pool.query(
      "SELECT * FROM categories"
    );

    if (rowCount === 0) throw new CustomError("Categories not found", 404);

    return allCategories;
  }

  async getCategoryById(id) {
    const {
      rows: [category],
      rowCount,
    } = await pool.query("SELECT * FROM categories WHERE id = $1", [id]);

    if (rowCount === 0) throw new CustomError("Category not found", 404);

    return category;
  }

  async addCategory({ name, description }) {
    const {
      rows: [category],
    } = await pool.query("SELECT * FROM categories WHERE name = $1", [name]);

    if (category) throw new CustomError("Category already exists", 409);

    const {
      rows: [newCategory],
    } = await pool.query(
      "INSERT INTO categories(name, description) VALUES($1, $2) RETURNING *",
      [name, description]
    );

    return {
      message: "Category added successfully",
      category: newCategory,
    };
  }

  async updateCategory(id, { name: catName, description }) {
    const { rowCount } = await pool.query(
      "SELECT * FROM categories WHERE id = $1",
      [id]
    );

    if (rowCount === 0) throw new CustomError("Category not found", 404);

    const {
      rows: [updatedCategory],
    } = await pool.query(
      "UPDATE categories SET name = $1, description = $2 WHERE id = $3 RETURNING *",
      [catName, description, id]
    );

    return {
      message: "Category successfully updated",
      category: updatedCategory,
    };
  }

  async deleteCategory(id) {
    const { rowCount } = await pool.query(
      "SELECT * FROM categories WHERE id = $1",
      [id]
    );

    if (rowCount === 0) throw new CustomError("Category not found", 404);

    await pool.query("DELETE FROM categories WHERE id = $1", [id]);

    return {
      message: "Category successfully deleted",
    };
  }
}
