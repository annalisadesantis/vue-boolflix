var app = new Vue({
    el: "#root",
    data: {
        filterTitle: "",
        movies: []
    },
    methods:{
        getFasStar(average) {

            let valore = average / 2;
            let arrotondato = Math.round(valore);
            return arrotondato;
        },
        getFarStar(average) {

            let valore = average / 2;
            let arrotondato = Math.round(valore);
            let numero = 5 - arrotondato;

            return numero;
        },
        search(){
            axios
                .get('https://api.themoviedb.org/3/search/movie', {
                    params:{
                        api_key: 'ff1d795e3b22f2a6056bd3125c445371',
                        query: this.filterTitle
                    }
                })
                .then((results) => {
                    this.movies = results.data.results;
                    console.log(this.movies);
                    this.filterTitle = "";
                })
                .then((results) => {
                    this.movies.forEach((movie) => {

                        if(movie.original_language == "en"){
                            movie.original_language = "flag/unitedkindom.png";
                        }else if(movie.original_language == "it"){
                            movie.original_language = "flag/italy.png";
                        }else if(movie.original_language == "es"){
                            movie.original_language = "flag/spain.png";
                        }else if(movie.original_language == "pt"){
                            movie.original_language = "flag/portugal.png";
                        }else if(movie.original_language == "fr"){
                            movie.original_language = "flag/france.png";
                        }else if(movie.original_language == "de"){
                            movie.original_language = "flag/germany.png";
                        }
                    })
                })
        }

    }




});
