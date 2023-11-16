import Carts from "../dao/classes/carts.dao.js";

const carts = new Carts();

class CartManager {
  constructor() {}

  async readCarts(req, res) {
    try {
      let cartsAvailable = await carts.getCarts();
      return res.send({ result: "success", payload: cartsAvailable });
    } catch (error) {
      console.log("err", error);
      return res.status(500).send("Server Error");
    }
  }

  async getCartByID(req, res) {
    let { id } = req.params;
    try {
      let cartsInfo = carts.getCartByID(id);
      return res.render("cartProducts", { cartsInfo });
    } catch (error) {
      console.log("err", error);
      return res.status(500).send("Server Error");
    }
  }

  async createCart(req, res) {
    try {
      let result = carts.createCart();
      return res.send({ result: "success", payload: result });
    } catch (error) {
      console.log("err", error);
      return res.status(500).send("Server Error");
    }
  }

  async createProductInCart(req, res) {
    let { cid, pid } = req.params;
    let quantity = req.body.quantity;

    try {
      if (!cid || !pid || !quantity) {
        return res.send({
          status: "error",
          error: "Missing product, cart, or quantity",
        });
      }

      let updatedCart = await carts.createProductInCart(cid, pid, quantity);

      return res.send({
        result: "success",
        payload: updatedCart,
      });
    } catch (error) {
      console.log("err", error.message);
      return res.status(500).send("Server Error");
    }
  }

  async addMultipleProductsToCart(req, res) {
    let { cid } = req.params;
    let products = req.body;

    try {
      let updatedCart = await carts.addMultipleProductsToCart(cid, products);
      return res.send({
        result: "success",
        payload: updatedCart,
      });
    } catch (error) {
      console.log("err", error);
      return res.status(500).send("Server Error");
    }
  }

  async deleteCart(req, res) {
    try {
      let { id } = req.params;
      let result = carts.deleteCart(id);
      return res.send({ result: "success", payload: result });
    } catch (error) {
      console.log("err", error);
      return res.status(500).send("Server Error");
    }
  }

  async deleteProductInCart(req, res) {
    let { cid, pid } = req.params;

    try {
      if (!cid || !pid) {
        return res.send({
          status: "error",
          error: "Invalid cart or product ID",
        });
      }

      let updatedCart = await carts.deleteProductInCart(cid, pid);

      return res.send({ status: "success", payload: updatedCart });
    } catch (error) {
      console.log("err", error);
      return res.status(500).send("Server Error");
    }
  }
}

export default CartManager;
