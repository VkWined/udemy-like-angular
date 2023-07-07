import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';


interface Course {
  id: string;
  name: string;
  description: string;
  price: number;
}

interface Order {
  id: string;
  date: string;
  courses: {[id: string]: Course};
}

interface KeyValue {
  key: string;
  value: Course;
}

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})
export class OrderListComponent implements OnInit {
  orders: Order[] = [];

  constructor(
    private orderService: OrderService,
    private authService: AuthService
  ) { }

  async ngOnInit() {
    const userId = this.authService.getUserId();
    if (userId !== null) { 
      this.orders = (await this.orderService.getOrders(userId)).map(order => ({
        ...order,
        date: order.date.toDate()
      }));
      
    } else {
      // handle error when userId is null
    }
  }
}

