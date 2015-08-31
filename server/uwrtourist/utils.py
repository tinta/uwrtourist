import requests
import functools

GEOCODING_ENDPOINT = "http://maps.googleapis.com/maps/api/geocode/json"

def memoize(method):
    cache = {}
    @functools.wraps(method)
    def wrapper(*args):
        arg_str = ",".join(args)
        if arg_str in cache:
            return cache[arg_str]
        else:
            result = method(*args)
            cache[arg_str] = result 
            return result
    return wrapper

@memoize
def geocode(address):
    '''
    Leverages google maps API to geocode an address.
    '''
    response = requests.get(url, params={"address": address})
    if response.status_code != 200:
        raise Exception("Address not found")
    r = response.json() 
    coordinates = r["results"][0]["location"]
    return coordinates

@memoize
def reverse_geocode(lat, lng):
    '''
    Leverages google maps api to reverse geocode lat,long coordinates.
    '''
    latlng = ",".join([lat, lng])
    response = requests.get(url, params={"latlng": latlng, "sensor": False})
    if response.status_code != 200:
        raise Exception("Address not found")
    r = response.json() 
    denominations = ["administrative_area_level_3", "administrative_area_level_2", "administrative_area_level_1", "locality"]
    locality, country = "", ""
    return locality, country
