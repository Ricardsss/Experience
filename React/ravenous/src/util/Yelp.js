const apiKey  = "fJHtbfTI6J0XeYQYyq9Y2InY9Nf9JqOKzkyzizxfoFaNg4c9eBZ6C7U-4_56fbezFFiAKrEin9a1IdZEkEoGtSQo8Kn-Qr_rxLIIimaa6RCr-r8ajKwhowYqvcA9XnYx";
const Yelp = {
    search: (term, location, sortBy) => {
        return fetch(`https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?term=${term}&location=${location}&sort_by=${sortBy}`, {
            headers: {
                Authorization: `Bearer ${apiKey}`
            }
        }).then(response => {
            return response.json();
        }).then(jsonResponse => {
            if (jsonResponse.businesses) {
                return jsonResponse.businesses.map(business => {
                    return {
                        id: business.id,
                        imageSrc: business.image_url,
                        name: business.name,
                        address: business.location.address1,
                        city: business.location.city,
                        state: business.location.state,
                        zipCode: business.location.zip_code,
                        category: business.categories[0].title,
                        rating: business.rating,
                        reviewCount: business.review_count,
                        websiteUrl: business.url
                    }
                });
            }
        });
    }
};

export default Yelp;