var app = new Vue({
    el: "#root",
    data: {
        // Input di ricerca
        filterTitle: "",
        // Array film
        movies: [],
        // Array serie tv
        serie: [],
        // Array film + array serie tv
        allresults: [],
        // Array flag disponibili
        availableFlags: ['it', 'en', 'es', 'fr', 'de', 'pt', 'zh', 'ru', 'ja'],
        // Chiave per salvare la ricerca
        testo_titolo: "",
        // Ricerca titolo
        ricerca_in_corso: false,
        // Url imaggine base
        url_img: "https://image.tmdb.org/t/p/w342",
        // contatore contatto corrente
        movieactive: -1

    },
    methods:{
        // Funzione per calcolare il voto in 5/5
        getFasStar(average) {

            // Divido il valore voto
            let valore = average / 2;
            // Arrotondo il valore per eccesso
            let arrotondato = Math.round(valore);
            return arrotondato;
        },
        search(){

            // Eseguo la ricerca solo se il campo è stato compilato
            if(this.filterTitle.trim() != ''){

                // Attivo la ricerca in corso su true
                this.ricerca_in_corso = true;

                // Mi assicuro che gli array siano stati svuotati
                this.movies = [];
                this.serie = [];
                this.allresults = [];

                // Salvo il dato della ricerca in un'altra chiave
                this.testo_titolo = this.filterTitle;

                // Chiamata get per i film
                axios.get('https://api.themoviedb.org/3/search/movie', {
                    params:{
                        api_key: 'ff1d795e3b22f2a6056bd3125c445371',
                        query: this.filterTitle
                    }
                })
                .then((results) => {
                    // Assegno al risultato dell'api all'array movies
                    this.movies = results.data.results;
                    // Ripulisco l'input
                    this.filterTitle = "";
                });
                // Chiamata get per le serie tv
                axios.get('https://api.themoviedb.org/3/search/tv', {
                    params:{
                        api_key: 'ff1d795e3b22f2a6056bd3125c445371',
                        query: this.filterTitle
                    }
                })
                .then((results) => {
                    // Assegno al risultato dell'api all'array serie
                    this.serie = results.data.results;
                    // Assegno ad uno nuovo array il risultato dei due array film e serie
                    this.allresults = this.movies.concat(this.serie);
                    // Rimposta lo stato della ricerca su false in quanto in questa fase è terminata
                    this.ricerca_in_corso = false;
                    console.log(this.allresults);

                    // Creo un ciclo per modificare l'url delle immagini
                    this.allresults.forEach((item) => {

                        if (item.poster_path != null) {
                            item.poster_path = this.url_img + item.poster_path;
                        // Quando hanno null inserisco un'immagine salvata
                        }else{
                            item.poster_path = 'img-no-disp.png';
                        }
                    });

                });
            }
        },
        mouseenter(index){
            console.log("trovato");
            this.movieactive = index;
        },
        mouseleave(index){
            console.log("lasciato");
            this.movieactive = -1;
        }

    },
    mounted(){
        axios.get('https://api.themoviedb.org/3/movie/top_rated', {
            params:{
                api_key: 'ff1d795e3b22f2a6056bd3125c445371',
            }
        })
        .then((results) => {
            // Assegno al risultato dell'api all'array movies
            this.allresults = results.data.results;
            console.log(this.allresults);
            this.allresults.forEach((item) => {

                if (item.poster_path != null) {
                    item.poster_path = this.url_img + item.poster_path;
                // Quando hanno null inserisco un'immagine salvata
                }else{
                    item.poster_path = 'img-no-disp.png';
                }
            });
        });

    }
});
