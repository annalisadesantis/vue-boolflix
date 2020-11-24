var app = new Vue({
    el: "#root",
    data: {
        filterTitle: "",
        movies: []
    },
    methods:{
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
        }

    }




});
