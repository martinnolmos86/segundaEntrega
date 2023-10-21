const { promises: fs } = require("fs");

class ProductManager {
  constructor({ path }) {
    this.products = [];
    this.productIdCounter = 1;
    this.path = path;
    this.loadProducts();
  }

  //   Metodo para agregar producto

  async addProduct(title, description, price, thumbnail, code, stock) {
    // verificando si hay algun producto con el mismo codigo

    if (this.products.some((product) => product.code === code)) {
      throw new Error("Error: El código ya existe en la lista de productos.");
    }

    const newProduct = {
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
      id: this.productIdCounter++,
    };

    // Validamos que tenga todos los campos con el if

    if (
      typeof title !== "string" ||
      typeof description !== "string" ||
      typeof price !== "number" ||
      typeof code !== "number" ||
      typeof stock !== "number"
    ) {
      console.error("Error: Los tipos de datos no son correctos.");
      return;
    }

    await this.loadProducts();
    this.products.push(newProduct);
    await this.saveProducts();
  }

  //   Metodo para mostrar el array

  async getProduct() {
    await this.loadProducts();
    return this.products;
  }

  // Metodo para buscar un producto por su id

  getProductById(id) {
    const product = this.products.find((product) => product.id === id);

    if (!product) {
      return console.error("Error: Producto no encontrado (Not found).");
    }

    return product;
  }

  // Metodo para actualizar producto

  async updateProduct(id, updatedProperties) {
    const productIndex = this.products.findIndex(
      (product) => product.id === id
    );

    if (productIndex === -1) {
      throw new Error("Error: Producto no encontrado (Not found).");
    }

    if (updatedProperties.id) {
      throw new Error("No se permite cambiar el ID del producto.");
    }

    if (
      Object.keys(updatedProperties).some(
        (key) =>
          typeof updatedProperties[key] !== "string" &&
          typeof updatedProperties[key] !== "number"
      )
    ) {
      throw new Error(
        "Error: Los tipos de datos en las propiedades actualizadas no son correctos."
      );
    }

    // Actualiza solo las propiedades especificadas
    this.products[productIndex] = {
      ...this.products[productIndex],
      ...updatedProperties,
    };

    await this.saveProducts();
  }

  // Metodo para borrar producto

  async deleteProduct(id) {
    const productIndex = this.products.findIndex(
      (product) => product.id === id
    );

    if (productIndex === -1) {
      throw new Error("Error: Producto no encontrado (Not found).");
    }

    this.products.splice(productIndex, 1);
    await this.saveProducts();
  }

  // Metodo para guardar los productos en un archivo

  async saveProducts() {
    try {
      await fs.writeFile(this.path, JSON.stringify(this.products, null, 2));
    } catch (err) {
      console.error("Error al guardar los productos:", err);
    }
  }

  // Metodo para leer el JSON y convertirlos en javascript

  async loadProducts() {
    try {
      const data = await fs.readFile(this.path, "utf-8");
      this.products = JSON.parse(data);
    } catch (err) {
      this.products = [];
    }
  }
}

// Agregando productos

async function main() {
  const evento1 = new ProductManager({ path: "prod.json" });
  //   await evento1.addProduct("Caramelo", "Arcor", 122, "", 12, 15);
  //   await evento1.addProduct("Chicle", "Arcor", 22, "", 15, 18);
  const updatedProduct = {
    title: "Turron",
    price: 55,
  };

  console.log(await evento1.getProduct());
  await evento1.updateProduct(2, updatedProduct);
  console.log(await evento1.getProduct());

  //   console.log(await evento1.getProduct());
  //   await evento1.deleteProduct(1);
  //   console.log(await evento1.getProduct());
}

main();
