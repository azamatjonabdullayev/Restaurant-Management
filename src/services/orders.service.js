import pool from "../config/connect";
import CustomError from "../utils/error.utils";

export default class Orders {
  async getOrders() {
    const { rows: allOrders, rowCount } = await pool.query(
      "SELECT * FROM orders"
    );

    if (rowCount === 0) throw new CustomError("Orders not found", 404);

    return allOrders;
  }

  async getOrderById(id) {
    const { rows: order, rowCount } = await pool.query(
      "SELECT * FROM orders WHERE id = $1",
      [id]
    );

    if (rowCount === 0) throw new CustomError("Order not found", 404);

    return order[0];
  }

  async addNewOrder({ table_number, customer, total_amount }) {
    const { rows: newOrder } = await pool.query(
      "INSERT INTO orders(table_number, customer, total_amount) VALUES($1, $2, $3) RETURNING *",
      [table_number, customer, total_amount]
    );

    return {
      message: "Order was added successfully",
      order: newOrder[0],
    };
  }

  async updateOrderStatus(id, status) {
    const { rowCount } = await pool.query(
      "SELECT * FROM orders WHERE id = $1",
      [id]
    );

    if (rowCount === 0) throw new CustomError("Order not found", 404);

    await pool.query(
      "UPDATE orders SET status = $1, updates_at = CURRENT_TIMESTAMP WHERE id = $2",
      [status, id]
    );

    return {
      message: "Order status was updated successfully",
    };
  }
}
