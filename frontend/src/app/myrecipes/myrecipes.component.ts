import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { RecipeModel } from '../recipe.model';
import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-myrecipes',
  templateUrl: './myrecipes.component.html',
  styleUrls: ['./myrecipes.component.css']
})
export class MyrecipesComponent implements OnInit {
  recipes : RecipeModel[] = [];

  constructor(private recipeService: RecipeService, public _auth:AuthService, private _router: Router,  ) { }

  ngOnInit(): void {
    let userId = localStorage.getItem("UserID");
    this.recipeService.getmyRecipes(userId)
    .subscribe((data)=>{
      this.recipes = JSON.parse(JSON.stringify(data));
    })
  }
  
  UpdateRecipe(recipe:any){
    localStorage.setItem("updateRecipeId" , recipe._id.toString());
    this._router.navigate(['/updaterecipe']);
  }

  DeleteRecipe(recipe: any){
    this.recipeService.deleteRecipe(recipe._id)
    .subscribe((data)=>{
      this.recipes = this.recipes.filter(b => b !== recipe);  //deletes product from list (line 14) and shows the list of products that is != the deleted product
    })
  }

}
