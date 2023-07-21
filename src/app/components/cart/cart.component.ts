import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { AuthService } from 'src/app/services/auth.service';
import { OrderService } from 'src/app/services/order.service';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';


@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartItems: { id: string; name: string; description: string; price: number }[] = [];
  totalPrice: number = 0;

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private orderService: OrderService
  ) {}

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
      this.generateReceipt();
      await this.cartService.clearCart(userId!);
      this.cartItems = [];
      this.totalPrice = 0;
    } catch (error) {
      console.error('Error during checkout: ', error);
    }
  }
  
  
  generateReceipt() {
    console.log('Cart Items:', this.cartItems); // Add this console log

    (pdfMake as any).vfs = pdfFonts.pdfMake.vfs;
    const docDefinition = {
      content: [
        { text: 'Receipt', style: 'header' },
        { text: 'Your order details:', style: 'subheader' },
        ...this.cartItems.map((item) => ({
          text: `Course name: ${item.name}\nPrice: $${item.price.toFixed(2)}`,
          style: 'content'
        })),
        { text: `Total Price: $${this.totalPrice.toFixed(2)}`, style: 'total' }
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: 10
        },
        subheader: {
          fontSize: 14,
          bold: true,
          margin: 10 
        },
        content: {
          fontSize: 12,
          margin: 5 
        },
        total: {
          fontSize: 14,
          bold: true,
          margin: 10 
        }
      },
    };
  
    pdfMake.createPdf(docDefinition).open();
  }
  
}
