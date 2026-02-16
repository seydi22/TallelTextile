const prisma = require("../utills/db");

async function getDashboardStats(request, response) {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const [
      totalProducts,
      totalOrders,
      ordersPending,
      ordersProcessing,
      ordersShipped,
      ordersDelivered,
      ordersCancelled,
      ordersToday,
    ] = await Promise.all([
      prisma.product.count(),
      prisma.customer_order.count(),
      prisma.customer_order.count({ where: { status: "pending" } }),
      prisma.customer_order.count({ where: { status: "processing" } }),
      prisma.customer_order.count({ where: { status: "shipped" } }),
      prisma.customer_order.count({ where: { status: "delivered" } }),
      prisma.customer_order.count({ where: { status: "cancelled" } }),
      prisma.customer_order.count({
        where: { dateTime: { gte: todayStart } },
      }),
    ]);

    const ordersByStatus = {
      pending: ordersPending,
      processing: ordersProcessing,
      shipped: ordersShipped,
      delivered: ordersDelivered,
      cancelled: ordersCancelled,
    };

    const ordersWithTotal = await prisma.customer_order.findMany({
      where: { status: { not: "cancelled" } },
      select: { total: true },
    });
    const totalRevenue = ordersWithTotal.reduce((sum, o) => sum + (Number(o.total) || 0), 0);

    return response.json({
      products: { total: totalProducts },
      orders: {
        total: totalOrders,
        today: ordersToday,
        byStatus: ordersByStatus,
      },
      revenue: { total: totalRevenue },
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return response.status(500).json({
      error: "Internal server error",
      details: "Failed to fetch dashboard statistics",
    });
  }
}

module.exports = {
  getDashboardStats,
};
