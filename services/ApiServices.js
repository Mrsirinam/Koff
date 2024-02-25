import axios from "axios";
import { API_URL } from "../const";

export class ApiService {
  #apiURL = API_URL;

  constructor() {
    this.accessKey = localStorage.getItem("accessKey");
    console.log("this.accessKey: ", this.accessKey);
  }

  async getAccessKey() {
    try {
      if (!this.accessKey) {
        const responce = await axios.get(`${this.#apiURL}api/users/accessKey`);
        this.accessKey = responce.data.accessKey;
        localStorage.setItem("accassKey, this.accessKey");
      }
    } catch (error) {
      console.log("error:", error);
    }
  }

  //функция для получения данных
  async getData(pathname, params = {}) {
    if (!this.accessKey) {
      await this.getAccessKey();
    }
    try {
      const responce = await axios.get(`${this.#apiURL}${pathname}`, {
        headers: {
          Authorization: `Bearer ${this.accessKey}`,
        },
        params,
      });

      return responce.data;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        this.accessKey = null;
        localStorage.removeItem("accessKey");

        return this.getData(pathname, params);
      } else {
        console.log(error);
      }
    }
  }

  async getProducts(page = 1, limit = 12, list, category, q) {
    return await this.getData("api/products", {
      page,
      limit,
      list,
      category,
      q,
    });
  }

  async getProductCategories() {
    return await this.getData("api/productCategories");
  }

  async getProductById(id) {
    return await this.getData(`api/products/${id}`);
  }
}
