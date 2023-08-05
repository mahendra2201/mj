import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

interface Restaurant {
  _id: string;
  restaurantName: string;
  description: string;
  location: string;
  cuisine: string;
  openingHours: string;
  contactNumber: string;
  address: string;
  menu: MenuItem[];
}

interface MenuItem {
  itemId: string;
  itemName: string;
  price: number;
  description: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string | any;
  password: string | any;
  role: string | any;
  userId!: string;

  private _isLoggedIn: boolean = false; // private backing field for isLoggedIn

  restaurants: Restaurant[] | any;

  constructor(private http: HttpClient, private authService: AuthService, private router: Router) {
    if (this.authService.isLoggedIn()) {
      this._isLoggedIn = true;
      this.authService.getRestaurants().subscribe(
        (restaurants: Restaurant[]) => {
          this.restaurants = restaurants;
        },
        (error: any) => {
          console.log(error);
        }
      );
    }
  }

  login() {
    console.log(this.username);
    console.log(this.role);
    console.log(this.password);

    this.authService.login(this.username, this.password, this.role).subscribe(
      (response: any) => {
        // set token received from server
        this.authService.setToken(response.token);
        localStorage.setItem('role', this.role); // store usertype in localStorage
        localStorage.setItem('password', this.password); // store usertype in localStorage
        localStorage.setItem('username', this.username); // store usertype in localStorage

        this.userId = response.user._id; // Set the userId from the response
        console.log('herrrrr', this.userId);

        this._isLoggedIn = true; // modify the private backing field

        this.authService.getRestaurants().subscribe(
          (restaurants: Restaurant[]) => {
            this.restaurants = restaurants;
          },
          (error: any) => {
            console.log(error);
          }
        );

        this.authService.setUserId(this.userId);

        alert(`Welcome to our login page ${this.username}!`);
        // location.href = "/";
        this.router.navigate(['/']);

      },
      (error: any) => {
        this.router.navigate(['/login']);
        console.log(error);
        alert('Invalid Username or Password or Usertype Failed!');
      }
    );
  }

  get isLoggedIn() {
    return this._isLoggedIn; // return the private backing field
  }
}
