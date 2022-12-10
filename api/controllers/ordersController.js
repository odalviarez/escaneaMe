const { Order } = require("../models/orderModel");
//const { auth, isUser, isAdmin } = require("../middleware/auth");

const router = require("express").Router();

//CREATE

// createOrder is fired by stripe webhook
// example endpoint

//* CREATE ORDER

router.post("/", async (req, res) => {
  const newOrder = new Order(req.body);

  try {
    const savedOrder = await newOrder.save();
    res.status(201).send(savedOrder);
  } catch (err) {
    res.status(500).send(err);
  }
});


//* DELETE ORDER: exclusivo para ADMIN.
//TODO: pendiente implementar.
router.delete("/:id", async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.status(200).send("Order has been deleted...");
  } catch (err) {
    res.status(500).send(err);
  }
});

//* USER GET ORDERS: exclusivo para USUARIO.
//TODO: pendiente implementar.
router.get("/find/:email", async (req, res) => {
  const { email } = req.params
  try {
    const orders = await Order.find({ email });
    res.status(200).send(orders);
  } catch (err) {
    res.status(500).send(err);
  }
});

//* ADMIN GET ORDERS: exclusivo para ADMIN. Se utilizaría en el panel de control del admin para ver las órdenes del usuario.
//TODO: pendiente implementar.

router.get("/", async (req, res) => {
  try {
    const orders = await Order.find(); 
    res.status(200).send(orders);
  } catch (err) {
    res.status(500).send(err);
  }
});

//* GET MONTHLY INCOME: exclusivo para ADMIN. Se utilizaría en el panel de analíticas para ver ventas de la página.
//TODO: pendiente implementar.
router.get("/income", async (req, res) => {
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
  const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

  try {
    const income = await Order.aggregate([
      { $match: { createdAt: { $gte: previousMonth } } },
      {
        $project: {
          month: { $month: "$createdAt" },
          sales: "$amount",
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: "$sales" },
        },
      },
    ]);
    res.status(200).send(income);
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;