import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ExternalLink, Upload } from "lucide-react";
import { SuccessPage } from "./SuccessPage";

const formSchema = z.object({
  trainer_full_name: z.string().min(2, "Full name is required"),
  workshop_date: z.string().min(1, "Workshop date is required"),
  workshop_location: z.string().min(2, "Workshop location is required"),
  region: z.string().min(1, "Region is required"),
  province: z.string().min(1, "Province is required"),
  lgu: z.string().min(1, "LGU is required"),
  affiliation_type: z.enum(['School', 'Community', 'Workplace', 'University'], {
    required_error: "Please select an affiliation type",
  }),
  affiliation_name: z.string().min(2, "Affiliation name is required"),
  total_participants: z.number().min(1, "Total participants must be at least 1"),
  youth_count: z.number().min(0, "Youth count cannot be negative"),
  parent_count: z.number().min(0, "Parent count cannot be negative"),
  educator_count: z.number().min(0, "Educator count cannot be negative"),
}).refine((data) => {
  return data.youth_count + data.parent_count + data.educator_count === data.total_participants;
}, {
  message: "Breakdown totals must equal total participants",
  path: ["total_participants"],
});

interface TrainingReportFormProps {
  sessionType: 'hour_of_code' | 'depth_training';
  onBack: () => void;
  onSubmitSuccess: () => void;
}

// Philippine location data (simplified)
// Complete Philippine locations based on PSA PSGC Q4 2024 data
const philippineLocations = {
  "NCR": {
    name: "National Capital Region",
    provinces: {
      "Metro Manila": ["Caloocan", "Las Piñas", "Makati", "Malabon", "Mandaluyong", "Manila", "Marikina", "Muntinlupa", "Navotas", "Parañaque", "Pasay", "Pasig", "Quezon City", "San Juan", "Taguig", "Valenzuela", "Pateros"]
    }
  },
  "CAR": {
    name: "Cordillera Administrative Region",
    provinces: {
      "Abra": ["Bangued", "Boliney", "Bucay", "Bucloc", "Daguioman", "Danglas", "Dolores", "La Paz", "Lacub", "Lagangilang", "Lagayan", "Langiden", "Licuan-Baay", "Luba", "Malibcong", "Manabo", "Peñarrubia", "Pidigan", "Pilar", "Sallapadan", "San Isidro", "San Juan", "San Quintin", "Tayum", "Tineg", "Tubo", "Villaviciosa"],
      "Apayao": ["Kabugao", "Calanasan", "Conner", "Flora", "Luna", "Pudtol", "Santa Marcela"],
      "Benguet": ["La Trinidad", "Baguio", "Atok", "Bakun", "Bokod", "Buguias", "Itogon", "Kabayan", "Kapangan", "Kibungan", "Mankayan", "Sablan", "Tuba", "Tublay"],
      "Ifugao": ["Lagawe", "Aguinaldo", "Alfonso Lista", "Asipulo", "Banaue", "Hingyon", "Hungduan", "Kiangan", "Lamut", "Mayoyao", "Tinoc"],
      "Kalinga": ["Tabuk", "Balbalan", "Lubuagan", "Pasil", "Pinukpuk", "Rizal", "Tanudan", "Tinglayan"],
      "Mountain Province": ["Bontoc", "Barlig", "Bauko", "Besao", "Natonin", "Paracelis", "Sabangan", "Sadanga", "Sagada", "Tadian"]
    }
  },
  "Region I": {
    name: "Ilocos Region",
    provinces: {
      "Ilocos Norte": ["Laoag", "Batac", "Adams", "Bacarra", "Badoc", "Bangui", "Banna", "Burgos", "Carasi", "Currimao", "Dingras", "Dumalneg", "Marcos", "Nueva Era", "Pagudpud", "Paoay", "Pasuquin", "Piddig", "Pinili", "San Nicolas", "Sarrat", "Solsona", "Vintar"],
      "Ilocos Sur": ["Vigan", "Candon", "Alilem", "Banayoyo", "Bantay", "Burgos", "Cabugao", "Caoayan", "Cervantes", "Galimuyod", "Gregorio Del Pilar", "Lidlidda", "Magsingal", "Nagbukel", "Narvacan", "Quirino", "Salcedo", "San Emilio", "San Esteban", "San Ildefonso", "San Juan", "San Vicente", "Santa", "Santa Catalina", "Santa Cruz", "Santa Lucia", "Santa Maria", "Santiago", "Santo Domingo", "Sigay", "Sinait", "Sugpon", "Suyo", "Tagudin"],
      "La Union": ["San Fernando", "Agoo", "Aringay", "Bacnotan", "Bagulin", "Balaoan", "Bangar", "Bauang", "Burgos", "Caba", "Luna", "Naguilian", "Pugo", "Rosario", "San Gabriel", "San Juan", "Santo Tomas", "Santol", "Sudipen", "Tubao"],
      "Pangasinan": ["Lingayen", "Alaminos", "Dagupan", "San Carlos", "Urdaneta", "Agno", "Aguilar", "Alcala", "Anda", "Asingan", "Balungao", "Bani", "Basista", "Bautista", "Bayambang", "Binalonan", "Binmaley", "Bolinao", "Bugallon", "Burgos", "Calasiao", "Dasol", "Infanta", "Labrador", "Laoac", "Malasiqui", "Manaoag", "Mangaldan", "Mangatarem", "Mapandan", "Natividad", "Pozorrubio", "Rosales", "San Fabian", "San Jacinto", "San Manuel", "San Nicolas", "San Quintin", "Santa Barbara", "Santa Maria", "Santo Tomas", "Sison", "Sual", "Tayug", "Umingan", "Urbiztondo", "Villasis"]
    }
  },
  "Region II": {
    name: "Cagayan Valley",
    provinces: {
      "Batanes": ["Basco", "Itbayat", "Ivana", "Mahatao", "Sabtang", "Uyugan"],
      "Cagayan": ["Tuguegarao", "Abulug", "Alcala", "Allacapan", "Amulung", "Aparri", "Baggao", "Ballesteros", "Buguey", "Calayan", "Camalaniugan", "Claveria", "Enrile", "Gattaran", "Gonzaga", "Iguig", "Lal-lo", "Lasam", "Pamplona", "Peñablanca", "Piat", "Rizal", "Sanchez-Mira", "Santa Ana", "Santa Praxedes", "Santa Teresita", "Santo Niño", "Solana", "Tuao"],
      "Isabela": ["Ilagan", "Santiago", "Cauayan", "Alicia", "Angadanan", "Aurora", "Benito Soliven", "Burgos", "Cabagan", "Cabatuan", "Cordon", "Delfin Albano", "Dinapigue", "Divilacan", "Echague", "Gamu", "Jones", "Luna", "Maconacon", "Mallig", "Naguilian", "Palanan", "Quezon", "Quirino", "Ramon", "Reina Mercedes", "Roxas", "San Agustin", "San Guillermo", "San Isidro", "San Manuel", "San Mariano", "San Mateo", "San Pablo", "Santa Maria", "Santo Tomas", "Tumauini"],
      "Nueva Vizcaya": ["Bayombong", "Alfonso Castañeda", "Ambaguio", "Aritao", "Bagabag", "Bambang", "Dupax del Norte", "Dupax del Sur", "Kasibu", "Kayapa", "Quezon", "Santa Fe", "Solano", "Villaverde"],
      "Quirino": ["Cabarroguis", "Aglipay", "Diffun", "Maddela", "Nagtipunan", "Saguday"]
    }
  },
  "Region III": {
    name: "Central Luzon",
    provinces: {
      "Aurora": ["Baler", "Casiguran", "Dilasag", "Dinalungan", "Dingalan", "Dipaculao", "Maria Aurora", "San Luis"],
      "Bataan": ["Balanga", "Abucay", "Bagac", "Dinalupihan", "Hermosa", "Limay", "Mariveles", "Morong", "Orani", "Orion", "Pilar", "Samal"],
      "Bulacan": ["Malolos", "Meycauayan", "San Jose del Monte", "Angat", "Balagtas", "Baliuag", "Bocaue", "Bulakan", "Bustos", "Calumpit", "Doña Remedios Trinidad", "Guiguinto", "Hagonoy", "Marilao", "Norzagaray", "Obando", "Pandi", "Paombong", "Plaridel", "Pulilan", "San Ildefonso", "San Miguel", "San Rafael", "Santa Maria"],
      "Nueva Ecija": ["Palayan", "Cabanatuan", "Gapan", "San Antonio", "San Jose", "Science City of Muñoz", "Aliaga", "Bongabon", "Cabiao", "Carranglan", "Cuyapo", "Gabaldon", "General Mamerto Natividad", "General Tinio", "Guimba", "Jaen", "Laur", "Licab", "Llanera", "Lupao", "Nampicuan", "Pantabangan", "Peñaranda", "Quezon", "Rizal", "San Isidro", "San Leonardo", "Santa Rosa", "Santo Domingo", "Talavera", "Talugtug", "Zaragoza"],
      "Pampanga": ["San Fernando", "Angeles", "Mabalacat", "Apalit", "Arayat", "Bacolor", "Candaba", "Floridablanca", "Guagua", "Lubao", "Macabebe", "Magalang", "Masantol", "Mexico", "Porac", "Sasmuan", "Santa Ana", "Santa Rita", "Santo Tomas"],
      "Tarlac": ["Tarlac", "Anao", "Bamban", "Camiling", "Capas", "Concepcion", "Gerona", "La Paz", "Mayantoc", "Moncada", "Paniqui", "Pura", "Ramos", "San Clemente", "San Jose", "San Manuel", "Santa Ignacia", "Victoria"],
      "Zambales": ["Iba", "Olongapo", "Botolan", "Cabangan", "Candelaria", "Castillejos", "Masinloc", "Palauig", "San Antonio", "San Felipe", "San Marcelino", "San Narciso", "Santa Cruz", "Subic"]
    }
  },
  "Region IV-A": {
    name: "CALABARZON",
    provinces: {
      "Batangas": ["Batangas", "Lipa", "Tanauan", "Agoncillo", "Alitagtag", "Balayan", "Balete", "Bauan", "Calaca", "Calatagan", "Cuenca", "Ibaan", "Laurel", "Lemery", "Lian", "Lobo", "Mabini", "Malvar", "Mataas na Kahoy", "Nasugbu", "Padre Garcia", "Rosario", "San Jose", "San Juan", "San Luis", "San Nicolas", "San Pascual", "Santa Teresita", "Santo Tomas", "Taal", "Talisay", "Taysan", "Tingloy", "Tuy"],
      "Cavite": ["Trece Martires", "Cavite", "Tagaytay", "Alfonso", "Amadeo", "Bacoor", "Carmona", "Dasmariñas", "General Emilio Aguinaldo", "General Mariano Alvarez", "General Trias", "Imus", "Indang", "Kawit", "Magallanes", "Maragondon", "Mendez", "Naic", "Noveleta", "Rosario", "Silang", "Tanza", "Ternate"],
      "Laguna": ["Santa Cruz", "Biñan", "Cabuyao", "Calamba", "San Pablo", "San Pedro", "Alaminos", "Bay", "Calauan", "Cavinti", "Famy", "Kalayaan", "Liliw", "Los Baños", "Luisiana", "Lumban", "Mabitac", "Magdalena", "Majayjay", "Nagcarlan", "Paete", "Pagsanjan", "Pakil", "Pangil", "Pila", "Rizal", "San Antonio", "Santa Maria", "Santa Rosa", "Siniloan", "Victoria"],
      "Quezon": ["Lucena", "Tayabas", "Agdangan", "Alabat", "Atimonan", "Buenavista", "Burdeos", "Calauag", "Candelaria", "Catanauan", "Dolores", "General Luna", "General Nakar", "Guinayangan", "Gumaca", "Infanta", "Jomalig", "Lopez", "Lucban", "Macalelon", "Mauban", "Mulanay", "Padre Burgos", "Pagbilao", "Panukulan", "Patnanungan", "Perez", "Pitogo", "Plaridel", "Polillo", "Quezon", "Real", "Sampaloc", "San Andres", "San Antonio", "San Francisco", "San Narciso", "Sariaya", "Tagkawayan", "Tiaong", "Unisan"],
      "Rizal": ["Antipolo", "Angono", "Baras", "Binangonan", "Cainta", "Cardona", "Jalajala", "Morong", "Pililla", "Rodriguez", "San Mateo", "Tanay", "Taytay", "Teresa"]
    }
  },
  "MIMAROPA": {
    name: "MIMAROPA Region",
    provinces: {
      "Marinduque": ["Boac", "Buenavista", "Gasan", "Mogpog", "Santa Cruz", "Torrijos"],
      "Occidental Mindoro": ["Mamburao", "Abra de Ilog", "Calintaan", "Looc", "Lubang", "Magsaysay", "Paluan", "Rizal", "Sablayan", "San Jose", "Santa Cruz"],
      "Oriental Mindoro": ["Calapan", "Baco", "Bansud", "Bongabong", "Bulalacao", "Gloria", "Mansalay", "Naujan", "Pinamalayan", "Pola", "Puerto Galera", "Roxas", "San Teodoro", "Socorro", "Victoria"],
      "Palawan": ["Puerto Princesa", "Aborlan", "Agutaya", "Araceli", "Balabac", "Bataraza", "Brooke's Point", "Busuanga", "Cagayancillo", "Coron", "Culion", "Cuyo", "Dumaran", "El Nido", "Kalayaan", "Linapacan", "Magsaysay", "Narra", "Quezon", "Rizal", "Roxas", "San Vicente", "Sofronio Española", "Taytay"],
      "Romblon": ["Romblon", "Alcantara", "Banton", "Cajidiocan", "Calatrava", "Concepcion", "Corcuera", "Ferrol", "Looc", "Magdiwang", "Odiongan", "San Agustin", "San Andres", "San Fernando", "San Jose", "Santa Fe", "Santa Maria"]
    }
  },
  "Region V": {
    name: "Bicol Region",
    provinces: {
      "Albay": ["Legazpi", "Ligao", "Tabaco", "Bacacay", "Camalig", "Daraga", "Guinobatan", "Jovellar", "Libon", "Malilipot", "Malinao", "Manito", "Oas", "Pio Duran", "Polangui", "Rapu-Rapu", "Santo Domingo", "Tiwi"],
      "Camarines Norte": ["Daet", "Basud", "Capalonga", "Jose Panganiban", "Labo", "Mercedes", "Paracale", "San Lorenzo Ruiz", "San Vicente", "Santa Elena", "Talisay", "Vinzons"],
      "Camarines Sur": ["Pili", "Iriga", "Naga", "Baao", "Balatan", "Bato", "Bombon", "Buhi", "Bula", "Cabusao", "Calabanga", "Camaligan", "Canaman", "Caramoan", "Del Gallego", "Gainza", "Garchitorena", "Goa", "Lagonoy", "Libmanan", "Lupi", "Magarao", "Milaor", "Minalabac", "Nabua", "Ocampo", "Pamplona", "Pasacao", "Presentacion", "Ragay", "Sagñay", "San Fernando", "San Jose", "Sipocot", "Siruma", "Tigaon", "Tinambac"],
      "Catanduanes": ["Virac", "Bagamanoc", "Baras", "Bato", "Caramoran", "Gigmoto", "Pandan", "Panganiban", "San Andres", "San Miguel", "Viga"],
      "Masbate": ["Masbate", "Aroroy", "Baleno", "Balud", "Batuan", "Cataingan", "Cawayan", "Claveria", "Dimasalang", "Esperanza", "Mandaon", "Milagros", "Mobo", "Monreal", "Palanas", "Pio V. Corpuz", "Placer", "San Fernando", "San Jacinto", "San Pascual", "Uson"],
      "Sorsogon": ["Sorsogon", "Barcelona", "Bulan", "Bulusan", "Casiguran", "Castilla", "Donsol", "Gubat", "Irosin", "Juban", "Magallanes", "Matnog", "Pilar", "Prieto Diaz", "Santa Magdalena"]
    }
  },
  "Region VI": {
    name: "Western Visayas",
    provinces: {
      "Aklan": ["Kalibo", "Altavas", "Balete", "Banga", "Batan", "Buruanga", "Ibajay", "Lezo", "Libacao", "Madalag", "Makato", "Malay", "Malinao", "Nabas", "New Washington", "Numancia", "Tangalan"],
      "Antique": ["San Jose de Buenavista", "Anini-y", "Barbaza", "Belison", "Bugasong", "Caluya", "Culasi", "Hamtic", "Laua-an", "Libertad", "Pandan", "Patnongon", "San Remigio", "Sebaste", "Sibalom", "Tibiao", "Tobias Fornier", "Valderrama"],
      "Capiz": ["Roxas", "Cuartero", "Dao", "Dumalag", "Dumarao", "Ivisan", "Jamindan", "Ma-ayon", "Mambusao", "Panay", "Panitan", "Pilar", "Pontevedra", "President Roxas", "Sapi-an", "Sigma", "Tapaz"],
      "Guimaras": ["Jordan", "Buenavista", "Nueva Valencia", "San Lorenzo", "Sibunag"],
      "Iloilo": ["Iloilo", "Passi", "Ajuy", "Alimodian", "Anilao", "Badiangan", "Balasan", "Banate", "Barotac Nuevo", "Barotac Viejo", "Batad", "Bingawan", "Cabatuan", "Calinog", "Carles", "Concepcion", "Dingle", "Dueñas", "Dumangas", "Estancia", "Guimbal", "Igbaras", "Janiuay", "Lambunao", "Leganes", "Lemery", "Leon", "Maasin", "Miagao", "Mina", "New Lucena", "Oton", "Pavia", "Pototan", "San Dionisio", "San Enrique", "San Joaquin", "San Miguel", "San Rafael", "Santa Barbara", "Sara", "Tigbauan", "Tubungan", "Zarraga"],
      "Negros Occidental": ["Bacolod", "Bago", "Cadiz", "Escalante", "Himamaylan", "Kabankalan", "La Carlota", "Sagay", "San Carlos", "Silay", "Sipalay", "Talisay", "Victorias", "Binalbagan", "Calatrava", "Candoni", "Cauayan", "Enrique B. Magalona", "Hinigaran", "Hinoba-an", "Ilog", "Isabela", "La Castellana", "Manapla", "Moises Padilla", "Murcia", "Pontevedra", "Pulupandan", "Salvador Benedicto", "San Enrique", "Toboso", "Valladolid"]
    }
  },
  "NIR": {
    name: "Negros Island Region",
    provinces: {
      "Negros Oriental": ["Dumaguete", "Bais", "Bayawan", "Canlaon", "Guihulngan", "Tanjay", "Amlan", "Ayungon", "Bacong", "Basay", "Bindoy", "Dauin", "Jimalalud", "La Libertad", "Mabinay", "Manjuyod", "Pamplona", "San Jose", "Santa Catalina", "Siaton", "Sibulan", "Tayasan", "Valencia", "Vallehermoso", "Zamboanguita"]
    }
  },
  "Region VII": {
    name: "Central Visayas",
    provinces: {
      "Bohol": ["Tagbilaran", "Alburquerque", "Alicia", "Anda", "Antequera", "Baclayon", "Balilihan", "Batuan", "Bien Unido", "Bilar", "Buenavista", "Calape", "Candijay", "Carmen", "Catigbian", "Clarin", "Corella", "Cortes", "Dagohoy", "Danao", "Dauis", "Dimiao", "Duero", "Garcia Hernandez", "Getafe", "Guindulman", "Inabanga", "Jagna", "Lila", "Loay", "Loboc", "Loon", "Mabini", "Maribojoc", "Panglao", "Pilar", "President Carlos P. Garcia", "Sagbayan", "San Isidro", "San Miguel", "Sevilla", "Sierra Bullones", "Sikatuna", "Talibon", "Trinidad", "Tubigon", "Ubay", "Valencia"],
      "Cebu": ["Cebu", "Carcar", "Danao", "Lapu-Lapu", "Mandaue", "Naga", "Talisay", "Toledo", "Alcantara", "Alcoy", "Alegria", "Aloguinsan", "Argao", "Asturias", "Badian", "Balamban", "Bantayan", "Barili", "Bogo", "Boljoon", "Borbon", "Carmen", "Catmon", "Compostela", "Consolacion", "Cordova", "Daanbantayan", "Dalaguete", "Dumanjug", "Ginatilan", "Liloan", "Madridejos", "Malabuyoc", "Medellin", "Minglanilla", "Moalboal", "Oslob", "Pilar", "Pinamungajan", "Poro", "Ronda", "Samboan", "San Fernando", "San Francisco", "San Remigio", "Santa Fe", "Santander", "Sibonga", "Sogod", "Tabogon", "Tabuelan", "Tuburan", "Tudela"],
      "Siquijor": ["Siquijor", "Enrique Villanueva", "Larena", "Lazi", "Maria", "San Juan"]
    }
  },
  "Region VIII": {
    name: "Eastern Visayas",
    provinces: {
      "Biliran": ["Naval", "Almeria", "Biliran", "Cabucgayan", "Caibiran", "Culaba", "Kawayan", "Maripipi"],
      "Eastern Samar": ["Borongan", "Arteche", "Balangiga", "Balangkayan", "Can-avid", "Dolores", "General MacArthur", "Giporlos", "Guiuan", "Hernani", "Jipapad", "Lawaan", "Llorente", "Maslog", "Maydolong", "Mercedes", "Oras", "Quinapondan", "Salcedo", "San Julian", "San Policarpo", "Sulat", "Taft"],
      "Leyte": ["Tacloban", "Baybay", "Ormoc", "Abuyog", "Alangalang", "Albuera", "Babatngon", "Barugo", "Bato", "Burauen", "Calubian", "Capoocan", "Carigara", "Dagami", "Dulag", "Hilongos", "Hindang", "Inopacan", "Isabel", "Jaro", "Javier", "Julita", "Kananga", "La Paz", "Leyte", "MacArthur", "Mahaplag", "Matag-ob", "Matalom", "Mayorga", "Merida", "Palo", "Palompon", "Pastrana", "San Isidro", "San Miguel", "Santa Fe", "Tabango", "Tabontabon", "Tanauan", "Tolosa", "Tunga", "Villaba"],
      "Northern Samar": ["Catarman", "Allen", "Biri", "Bobon", "Capul", "Catubig", "Gamay", "Laoang", "Lapinig", "Las Navas", "Lavezares", "Lope de Vega", "Mapanas", "Mondragon", "Palapag", "Pambujan", "Rosario", "San Antonio", "San Isidro", "San Jose", "San Roque", "San Vicente", "Silvino Lobos", "Victoria"],
      "Samar": ["Catbalogan", "Calbayog", "Almagro", "Basey", "Calbiga", "Daram", "Gandara", "Hinabangan", "Jiabong", "Marabut", "Matuguinao", "Motiong", "Pagsanghan", "Paranas", "Pinabacdao", "San Jorge", "San Jose de Buan", "San Sebastian", "Santa Margarita", "Santa Rita", "Santo Niño", "Tagapul-an", "Talalora", "Tarangnan", "Villareal", "Zumarraga"],
      "Southern Leyte": ["Maasin", "Anahawan", "Bontoc", "Hinunangan", "Hinundayan", "Libagon", "Liloan", "Limasawa", "Macrohon", "Malitbog", "Padre Burgos", "Pintuyan", "Saint Bernard", "San Francisco", "San Juan", "San Ricardo", "Silago", "Sogod", "Tomas Oppus"]
    }
  },
  "Region IX": {
    name: "Zamboanga Peninsula",
    provinces: {
      "Zamboanga del Norte": ["Dipolog", "Dapitan", "Bacungan", "Baliguian", "Godod", "Gutalac", "Jose Dalman", "Kalawit", "Katipunan", "La Libertad", "Labason", "Leon B. Postigo", "Liloy", "Manukan", "Mutia", "Piñan", "Polanco", "Pres. Manuel A. Roxas", "Rizal", "Salug", "Sergio Osmeña Sr.", "Siayan", "Sibuco", "Sibutad", "Sindangan", "Siocon", "Sirawai", "Tampilisan"],
      "Zamboanga del Sur": ["Pagadian", "Zamboanga", "Aurora", "Bayog", "Dimataling", "Dinas", "Dumalinao", "Dumingag", "Guipos", "Josefina", "Kumalarang", "Labangan", "Lakewood", "Lapuyan", "Mahayag", "Margosatubig", "Midsalip", "Molave", "Pitogo", "Ramon Magsaysay", "San Miguel", "San Pablo", "Sominot", "Tabina", "Tambulig", "Tigbao", "Tukuran", "Vincenzo A. Sagun"],
      "Zamboanga Sibugay": ["Ipil", "Alicia", "Buug", "Diplahan", "Imelda", "Kabasalan", "Mabuhay", "Malangas", "Naga", "Olutanga", "Payao", "Roseller Lim", "Siay", "Talusan", "Titay", "Tungawan"]
    }
  },
  "Region X": {
    name: "Northern Mindanao",
    provinces: {
      "Bukidnon": ["Malaybalay", "Valencia", "Baungon", "Cabanglasan", "Damulog", "Dangcagan", "Don Carlos", "Impasugong", "Kadingilan", "Kalilangan", "Kibawe", "Kitaotao", "Lantapan", "Libona", "Malitbog", "Manolo Fortich", "Maramag", "Pangantucan", "Quezon", "San Fernando", "Sumilao", "Talakag"],
      "Camiguin": ["Mambajao", "Catarman", "Guinsiliban", "Mahinog", "Sagay"],
      "Lanao del Norte": ["Tubod", "Iligan", "Bacolod", "Baloi", "Baroy", "Kapatagan", "Kauswagan", "Kolambugan", "Lala", "Linamon", "Magsaysay", "Maigo", "Matungao", "Munai", "Nunungan", "Pantao Ragat", "Pantar", "Poona Piagapo", "Salvador", "Sapad", "Sultan Naga Dimaporo", "Tagoloan", "Tangcal"],
      "Misamis Occidental": ["Oroquieta", "Ozamiz", "Tangub", "Aloran", "Baliangao", "Bonifacio", "Calamba", "Clarin", "Concepcion", "Don Victoriano Chiongbian", "Jimenez", "Lopez Jaena", "Panaon", "Plaridel", "Sapang Dalaga", "Sinacaban", "Tudela"],
      "Misamis Oriental": ["Cagayan de Oro", "Gingoog", "Alubijid", "Balingasag", "Balingoan", "Binuangan", "Claveria", "El Salvador", "Gitagum", "Initao", "Jasaan", "Kinoguitan", "Lagonglong", "Laguindingan", "Libertad", "Lugait", "Magsaysay", "Manticao", "Medina", "Naawan", "Opol", "Salay", "Sugbongcogon", "Tagoloan", "Talisayan", "Villanueva"]
    }
  },
  "Region XI": {
    name: "Davao Region",
    provinces: {
      "Davao de Oro": ["Nabunturan", "Compostela", "Laak", "Mabini", "Maco", "Maragusan", "Mawab", "Monkayo", "Montevista", "New Bataan", "Pantukan"],
      "Davao del Norte": ["Tagum", "Panabo", "Samal", "Asuncion", "Braulio E. Dujali", "Carmen", "Kapalong", "New Corella", "San Isidro", "Santo Tomas", "Talaingod"],
      "Davao del Sur": ["Digos", "Davao", "Bansalan", "Don Marcelino", "Hagonoy", "Jose Abad Santos", "Kiblawan", "Magsaysay", "Malalag", "Matanao", "Padada", "Santa Cruz", "Sulop"],
      "Davao Occidental": ["Malita", "Don Marcelino", "Jose Abad Santos", "Santa Maria"],
      "Davao Oriental": ["Mati", "Baganga", "Banaybanay", "Boston", "Caraga", "Cateel", "Governor Generoso", "Lupon", "Manay", "San Isidro", "Tarragona"]
    }
  },
  "Region XII": {
    name: "SOCCSKSARGEN",
    provinces: {
      "Cotabato": ["Kidapawan", "Alamada", "Aleosan", "Antipas", "Arakan", "Banisilan", "Carmen", "Kabacan", "Libungan", "M'lang", "Magpet", "Makilala", "Matalam", "Midsayap", "Pigcawayan", "Pikit", "President Roxas", "Tulunan"],
      "Sarangani": ["Alabel", "Glan", "Kiamba", "Maasim", "Maitum", "Malapatan", "Malungon"],
      "South Cotabato": ["Koronadal", "General Santos", "Banga", "Lake Sebu", "Norala", "Polomolok", "Santo Niño", "Surallah", "T'boli", "Tampakan", "Tantangan", "Tupi"],
      "Sultan Kudarat": ["Isulan", "Tacurong", "Bagumbayan", "Columbio", "Esperanza", "Kalamansig", "Lebak", "Lutayan", "Lambayong", "Palimbang", "President Quirino", "Senator Ninoy Aquino"]
    }
  },
  "Region XIII": {
    name: "Caraga",
    provinces: {
      "Agusan del Norte": ["Butuan", "Cabadbaran", "Buenavista", "Carmen", "Jabonga", "Kitcharao", "Las Nieves", "Magallanes", "Nasipit", "Remedios T. Romualdez", "Santiago", "Tubay"],
      "Agusan del Sur": ["Prosperidad", "Bayugan", "Bunawan", "Esperanza", "La Paz", "Loreto", "Rosario", "San Francisco", "San Luis", "Santa Josefa", "Sibagat", "Talacogon", "Trento", "Veruela"],
      "Dinagat Islands": ["San Jose", "Basilisa", "Cagdianao", "Dinagat", "Libjo", "Loreto", "Tubajon"],
      "Surigao del Norte": ["Surigao", "Alegria", "Bacuag", "Burgos", "Claver", "Dapa", "Del Carmen", "General Luna", "Gigaquit", "Mainit", "Malimono", "Pilar", "Placer", "San Benito", "San Francisco", "San Isidro", "Santa Monica", "Sison", "Socorro", "Tagana-an", "Tubod"],
      "Surigao del Sur": ["Tandag", "Bislig", "Adlay", "Barobo", "Bayabas", "Cagwait", "Cantilan", "Carmen", "Carrascal", "Cortes", "Hinatuan", "Lanuza", "Lianga", "Lingig", "Madrid", "Marihatag", "San Agustin", "San Miguel", "Tagbina", "Tago"]
    }
  },
  "BARMM": {
    name: "Bangsamoro Autonomous Region in Muslim Mindanao",
    provinces: {
      "Basilan": ["Isabela", "Lamitan", "Akbar", "Al-Barka", "Hadji Mohammad Ajul", "Hadji Muhtamad", "Lantawan", "Maluso", "Sumisip", "Tabuan-Lasa", "Tipo-Tipo", "Tuburan", "Ungkaya Pukan"],
      "Lanao del Sur": ["Marawi", "Bacolod-Kalawi", "Balabagan", "Balindong", "Bayang", "Binidayan", "Buadiposo-Buntong", "Bubong", "Butig", "Calanogas", "Ditsaan-Ramain", "Ganassi", "Kapai", "Kapatagan", "Lumba-Bayabao", "Lumbaca-Unayan", "Lumbatan", "Lumbayanague", "Madalum", "Madamba", "Maguing", "Malabang", "Marantao", "Marogong", "Masiu", "Mulondo", "Pagayawan", "Piagapo", "Picong", "Poona Bayabao", "Pualas", "Saguiaran", "Sultan Dumalondong", "Tagoloan II", "Tamparan", "Taraka", "Tubaran", "Tugaya", "Wao"],
      "Maguindanao del Norte": ["Datu Odin Sinsuat", "Kabuntalan", "Upi", "Sultan Kudarat", "Sultan Mastura", "Parang", "Barira", "Buldon", "Matanog", "Northern Kabuntalan", "Datu Blah T. Sinsuat", "Cotabato"],
      "Maguindanao del Sur": ["Buluan", "Datu Abdullah Sangki", "Datu Anggal Midtimbang", "Datu Hoffer Ampatuan", "Datu Montawal", "Datu Paglas", "Datu Piang", "Datu Salibo", "Datu Saudi-Ampatuan", "Datu Unsay", "General Salipada K. Pendatun", "Guindulungan", "Mamasapano", "Mangudadatu", "Pandag", "Paglat", "Rajah Buayan", "Shariff Aguak", "Shariff Saydona Mustapha", "South Upi", "Sultan sa Barongis", "Talayan"],
      "Sulu": ["Jolo", "Banguingui", "Hadji Panglima Tahil", "Indanan", "Kalingalan Caluang", "Lugus", "Luuk", "Maimbung", "Old Panamao", "Omar", "Pandami", "Panglima Estino", "Pangutaran", "Parang", "Pata", "Patikul", "Siasi", "Talipao", "Tapul"],
      "Tawi-Tawi": ["Bongao", "Languyan", "Mapun", "Panglima Sugala", "Sapa-Sapa", "Sibutu", "Simunul", "Sitangkai", "South Ubian", "Tandubas", "Turtle Islands"]
    }
  }
};

export function TrainingReportForm({ sessionType, onBack, onSubmitSuccess }: TrainingReportFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [attendanceFile, setAttendanceFile] = useState<File | null>(null);
  const [trainerName, setTrainerName] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [submittedParticipantCount, setSubmittedParticipantCount] = useState(0);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      trainer_full_name: "",
      workshop_date: "",
      workshop_location: "",
      region: "",
      province: "",
      lgu: "",
      affiliation_type: undefined,
      affiliation_name: "",
      total_participants: 0,
      youth_count: 0,
      parent_count: 0,
      educator_count: 0,
    },
  });

  // Load trainer name from profile when component mounts
  useState(() => {
    const loadTrainerName = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('first_name, last_name')
          .eq('id', user.id)
          .single();
        
        if (profile && (profile.first_name || profile.last_name)) {
          const fullName = `${profile.first_name || ''} ${profile.last_name || ''}`.trim();
          setTrainerName(fullName);
          form.setValue('trainer_full_name', fullName);
        }
      }
    };
    loadTrainerName();
  });

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: `${file.name} is larger than 5MB`,
          variant: "destructive",
        });
        return false;
      }
      return file.type.startsWith('image/');
    });
    
    if (validFiles.length + photoFiles.length > 5) {
      toast({
        title: "Too many photos",
        description: "Maximum 5 photos allowed",
        variant: "destructive",
      });
      return;
    }
    
    setPhotoFiles([...photoFiles, ...validFiles]);
  };

  const handleAttendanceUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Attendance sheet must be smaller than 10MB",
          variant: "destructive",
        });
        return;
      }
      setAttendanceFile(file);
    }
  };

  const uploadFiles = async (userId: string, reportId: string) => {
    const uploadedPhotos: string[] = [];
    let attendanceUrl = '';

    // Upload photos
    for (let i = 0; i < photoFiles.length; i++) {
      const file = photoFiles[i];
      const fileName = `${userId}/${reportId}/photo_${i + 1}_${file.name}`;
      
      const { data, error } = await supabase.storage
        .from('master-trainer-reports')
        .upload(fileName, file);
      
      if (error) throw error;
      uploadedPhotos.push(data.path);
    }

    // Upload attendance sheet
    if (attendanceFile) {
      const fileName = `${userId}/${reportId}/attendance_${attendanceFile.name}`;
      
      const { data, error } = await supabase.storage
        .from('master-trainer-reports')
        .upload(fileName, attendanceFile);
      
      if (error) throw error;
      attendanceUrl = data.path;
    }

    return { uploadedPhotos, attendanceUrl };
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!photoFiles.length) {
      toast({
        title: "Photos required",
        description: "Please upload at least one event photo",
        variant: "destructive",
      });
      return;
    }

    if (!attendanceFile) {
      toast({
        title: "Attendance sheet required",
        description: "Please upload the attendance sheet",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // Insert the report first to get the ID
      const { data: report, error: reportError } = await supabase
        .from('training_reports')
        .insert({
          user_id: user.id,
          session_type: sessionType,
          trainer_full_name: values.trainer_full_name,
          workshop_date: values.workshop_date,
          workshop_location: values.workshop_location,
          region: values.region,
          province: values.province,
          lgu: values.lgu,
          affiliation_type: values.affiliation_type,
          affiliation_name: values.affiliation_name,
          total_participants: values.total_participants,
          youth_count: values.youth_count,
          parent_count: values.parent_count,
          educator_count: values.educator_count
        })
        .select()
        .single();

      if (reportError) throw reportError;

      // Upload files
      const { uploadedPhotos, attendanceUrl } = await uploadFiles(user.id, report.id);

      // Update the report with file URLs
      const { error: updateError } = await supabase
        .from('training_reports')
        .update({
          photo_urls: uploadedPhotos,
          attendance_sheet_url: attendanceUrl,
        })
        .eq('id', report.id);

      if (updateError) throw updateError;

      // Update progress targets by accumulating the new participants
      const fieldToUpdate = sessionType === 'hour_of_code' ? 'hour_of_code_current' : 'depth_training_current';
      
      // First, get the current targets to add to existing count
      const { data: currentTargets } = await supabase
        .from('master_trainer_targets')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      const currentCount = currentTargets?.[fieldToUpdate] || 0;
      const newTotal = currentCount + values.total_participants;
      
      const { error: progressError } = await supabase
        .from('master_trainer_targets')
        .upsert({
          user_id: user.id,
          [fieldToUpdate]: newTotal
        }, {
          onConflict: 'user_id',
          ignoreDuplicates: false
        });
      
      if (progressError) {
        console.warn('Error updating progress:', progressError);
        // Don't fail the entire submission if progress update fails
      }

      // Store participant count and show success page
      setSubmittedParticipantCount(values.total_participants);
      setShowSuccess(true);
    } catch (error) {
      console.error('Error submitting report:', error);
      toast({
        title: "Submission failed",
        description: "There was an error submitting your report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showSuccess) {
    return (
      <SuccessPage 
        sessionType={sessionType}
        participantCount={submittedParticipantCount}
        onBackToDashboard={onSubmitSuccess}
      />
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>
            {sessionType === 'hour_of_code' ? '⏰ Hour of Code' : '🎓 12-Hour Training'} Session Report
          </CardTitle>
          <CardDescription>
            Complete all required fields to submit your training session report
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="trainer_full_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name of Master Trainer</FormLabel>
                    <FormControl>
                      <Input {...field} disabled className="bg-muted" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="workshop_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of Workshop</FormLabel>
                      <FormControl>
                        <Input {...field} type="date" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="workshop_location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Workshop Location</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g., Manila City Hall" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Location Details</h3>
                
                <div className="grid md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="region"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Region</FormLabel>
                        <Select 
                          onValueChange={(value) => {
                            field.onChange(value);
                            setSelectedRegion(value);
                            setSelectedProvince("");
                            form.setValue('province', '');
                            form.setValue('lgu', '');
                          }}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select region" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Object.entries(philippineLocations).map(([key, region]) => (
                              <SelectItem key={key} value={key}>
                                {region.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="province"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Province</FormLabel>
                        <Select 
                          onValueChange={(value) => {
                            field.onChange(value);
                            setSelectedProvince(value);
                            form.setValue('lgu', '');
                          }}
                          value={field.value}
                          disabled={!selectedRegion}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select province" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {selectedRegion && philippineLocations[selectedRegion as keyof typeof philippineLocations] &&
                              Object.keys(philippineLocations[selectedRegion as keyof typeof philippineLocations].provinces).map((province) => (
                                <SelectItem key={province} value={province}>
                                  {province}
                                </SelectItem>
                              ))
                            }
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="lgu"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>LGU</FormLabel>
                        <Select 
                          onValueChange={field.onChange}
                          value={field.value}
                          disabled={!selectedProvince}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select LGU" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {selectedRegion && selectedProvince && 
                              philippineLocations[selectedRegion as keyof typeof philippineLocations]?.provinces[selectedProvince]?.map((lgu) => (
                                <SelectItem key={lgu} value={lgu}>
                                  {lgu}
                                </SelectItem>
                              ))
                            }
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="affiliation_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type of Affiliation of Participants</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select affiliation type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="School">School</SelectItem>
                          <SelectItem value="Community">Community</SelectItem>
                          <SelectItem value="Workplace">Workplace</SelectItem>
                          <SelectItem value="University">University</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="affiliation_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name of Affiliation</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g., ABC Elementary School" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Participant Summary</h3>
                
                <FormField
                  control={form.control}
                  name="total_participants"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total Number of Participants</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          type="number" 
                          min="1"
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="youth_count"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Youth</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            type="number" 
                            min="0"
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="parent_count"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Parent</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            type="number" 
                            min="0"
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="educator_count"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Educator</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            type="number" 
                            min="0"
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Documentation</h3>
                
                <div>
                  <Label htmlFor="photos">Upload Event Photos (Max 5MB each, up to 5 photos)</Label>
                  <Input
                    id="photos"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="mt-1"
                  />
                  {photoFiles.length > 0 && (
                    <div className="mt-2 text-sm text-muted-foreground">
                      {photoFiles.length} photo(s) selected
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <Label htmlFor="attendance">Attendance Sheet</Label>
                    <Button
                      type="button"
                      variant="link"
                      size="sm"
                      onClick={() => window.open('https://docs.google.com/spreadsheets/d/1W7lBLNerjb2KBkgfdasIFih_nOu7VyMFZh_EXVJfCME/edit?usp=sharing', '_blank')}
                      className="p-0 h-auto text-xs"
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      View Template
                    </Button>
                  </div>
                  <Input
                    id="attendance"
                    type="file"
                    accept=".xlsx,.xls,.csv,.pdf"
                    onChange={handleAttendanceUpload}
                  />
                  {attendanceFile && (
                    <div className="mt-2 text-sm text-muted-foreground">
                      {attendanceFile.name} selected
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <Button type="button" variant="outline" onClick={onBack}>
                  ← Back
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Submit Report'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}