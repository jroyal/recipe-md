# {{name}}

{{{summary}}}

<p align="center">
  <img width="460" height="300" src="{{{meta.image}}}">
</p>

| Author     	| {{meta.author}}           	|
| Published  	| {{meta.published}}        	|
| Prep Time  	| {{details.preptime}}      	|
| Cook Time  	| {{details.cooktime}}      	|
| Total Time 	| {{details.totaltime}}     	|
| Servings   	| {{details.servings}}      	|
| Source     	| [Original URL]({{{url}}}) 	|

## Ingredients

{{#ingredients}}
- {{{formatIngredient}}}
{{/ingredients}}

## Instructions

{{#instructions}}
1. {{{.}}}
{{/instructions}}

{{#notes.length}}
## Notes

{{#notes}}
- {{{.}}}
{{/notes}}
{{/notes.length}}
