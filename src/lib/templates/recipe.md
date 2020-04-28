# {{name}}

{{{summary}}}

<p align="center">
  <img max-width="224" height="224" src="{{{meta.image}}}">
</p>

| Meta          | Details                       |
| ------------- | ----------------------------- |
| Author     	| {{meta.author}}           	|
| Published  	| {{meta.published}}        	|
| Prep Time  	| {{details.preptime}}      	|
| Cook Time  	| {{details.cooktime}}      	|
| Total Time 	| {{details.totaltime}}     	|
| Servings   	| {{details.servings}}      	|
| Source     	| [Original URL]({{{url}}}) 	|

## Ingredients

{{#ingredientGroups}}
{{#name}}
#### {{name}}

{{/name}}
{{#ingredients}}
- {{{formatIngredient}}}
{{/ingredients}}

{{/ingredientGroups}}

## Instructions

{{#instructionGroups}}
{{#name}}
#### {{name}}

{{/name}}
{{#instructions}}
1. {{{.}}}
{{/instructions}}

{{/instructionGroups}}

{{#notes.length}}
## Notes

{{#notes}}
- {{{.}}}
{{/notes}}
{{/notes.length}}
