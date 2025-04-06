import pool from "../config/connect";
import CustomError from "../utils/error.utils";

export default class OrderMenu {
  async showAllOrders() {
    const query = `SELECT o.customer_name, o.table_number, o.status, o.total_amount, m.name AS menu_name, m.price 
      FROM order_menu om
      JOIN orders o ON o.id = om.order_id
      JOIN menu m ON m.id = om.menu_item_id
      ORDER BY o.id`;

    const { rowCount, rows: orders } = await pool.query(query);

    if (rowCount === 0) throw new CustomError("Orders not found", 404);

    return orders;
  }

  async showOrderById(id) {
    const query = `SELECT o.customer_name, o.table_number, o.status, o.total_amount, m.name AS menu_name, m.price 
      FROM order_menu om
      JOIN orders o ON o.id = om.order_id
      JOIN menu m ON m.id = om.menu_item_id
      WHERE o.id = $1`;

    const {
      rowCount,
      rows: [order],
    } = await pool.query(query, [id]);

    if (rowCount === 0) throw new CustomError("Order not found", 404);

    return order;
  }

  async updateOrderStatus(id, status) {
    await this.showOrderById(id);

    await pool.query(
      "UPDATE orders SET status = $1, updates_at = CURRENT_TIMESTAMP WHERE id = $2",
      [status, id]
    );

    return {
      message: "Order status was updated successfully",
    };
  }
}
