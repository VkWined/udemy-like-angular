import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { AuthService } from 'src/app/services/auth.service';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartItems: {id: string, name: string, description: string, price: number}[] = [];
  totalPrice: number = 0;

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private orderService: OrderService
  ) { }

  async ngOnInit() {
    const userId = this.authService.getUserId();
    this.cartItems = await this.cartService.getCartCourses(userId!);
    this.totalPrice = await this.cartService.calculateTotalPrice(userId!);
  }

  async removeFromCart(courseId: string) {
    const userId = this.authService.getUserId();
    await this.cartService.deleteCourseFromCart(userId!, courseId);
    this.cartItems = await this.cartService.getCartCourses(userId!);
    this.totalPrice = await this.cartService.calculateTotalPrice(userId!);
  }

  async checkout() {
    const userId = this.authService.getUserId();
    try {
      await this.orderService.createOrder(userId!, this.cartItems);
      await this.cartService.clearCart(userId!);
      this.cartItems = [];
      this.totalPrice = 0;
    } catch (error) {
      console.error('Error during checkout: ', error);
    }
  }
}
