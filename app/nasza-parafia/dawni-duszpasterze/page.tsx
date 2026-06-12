'use client';

import MaxWidthWrapper from '@/components/MaxWidthWrapper';

export default function DawniDuszpasterze() {
	return (
		<main className="flex min-h-screen flex-col items-center justify-between bg-white relative overflow-hidden">
			<MaxWidthWrapper className="flex flex-col items-center justify-center mt-7">
				<hr className="w-full mb-7" />
				<div className="flex flex-col max-w-fit w-[100ch] mb-14">
					<h1 className="text-3xl font-bold mb-6">Dawni duszpasterze</h1>

					<h2 className="text-2xl font-semibold mb-4">Lista Proboszczów</h2>
					<ul className="list-disc pl-6 space-y-2 mb-8">
						<li>ks. Jan (Johannes) Fiegel (Kuratus): 15.06.1886 - 04.03.1888</li>
						<li>Ks. Teofil (Teophil) Schöneich: 04.03.1888 - 28.02.1913</li>
						<li>Ks. Józef (Josef) Bennek: 19.03.1913 - 17.04.1942 oraz 1945 - 28.10.1946</li>
						<li>Ks. Josef Hawellek (wikariusz-administrator): 17.04.1942 - 1945</li>
						<li>Ks. Emanuel Weber: 29.10.1946 - 01.06.1966</li>
						<li>Ks. Ginter Król: 13.07.1966 - 28.08.1998</li>
						<li>ks Andrzej Iwanecki: 28.08.1998 - 07.01.2018 (obecnie Biskup pomocniczy d. gliwickiej)</li>
						<li>Ks. Jarosław Buchenfeld: 15.01.2018 - 31.08.2023</li>
						<li>Ks. Tomasz Rak: 01.09.2023 - aktualnie</li>
					</ul>

					<h2 className="text-2xl font-semibold mb-4">Lista wikariuszy (wg lat posługi w parafii)</h2>
					<ul className="list-disc pl-6 space-y-2">
						<li>Ks. Franciszek Tylla: 11.12.1886 - 10.07.1888</li>
						<li>Ks. Józef (Josef) Kruppa: 10.07.1888 - 07.08.1888</li>
						<li>Ks. Alojzy (Aloys) Schudy: 07.08.1888 - 12.08.1889</li>
						<li>Ks. Franciszek (Franz) Karkosch: 12.08.1889 - 10.07.1894</li>
						<li>Ks. Konrad Czieschlik (Cieslik): 21.06.1894 - 15.12.1897</li>
						<li>Ks. Wilhelm Tunkel: 02.12.1897 - 02.08.1900</li>
						<li>Ks. Wiktor Schołtysik (Scholtyssek): 03.08.1898 - 13.08.1900</li>
						<li>Ks. Ryszard (Richard) Rassek: 03.08.1900 - 20.10.1901</li>
						<li>Ks. Albert Czipura (Cipura): 13.09.1900 - 28.12.1909</li>
						<li>Ks. Jan (Johannes) Cygan: 14.08.1901 - 17.02.1903</li>
						<li>Ks. Józef (Josef) Bennek: 02.12.1901 - 07.04.1902 (późniejszy proboszcz)</li>
						<li>Ks. Benno Drzezga: 08.04.1902 - 28.10.1902</li>
						<li>Ks. Paweł (Paul) Heyduck: 28.10.1902 - 12.10.1903</li>
						<li>Ks. Paweł (Paul) Kaisig: 19.02.1903 - 01.07.1905</li>
						<li>Ks. Maksymilian (Maximilian) Lipka: 03.10.1903 - 20.11.1904</li>
						<li>Ks. Franciszek (Franz) Lukaschkowitz: 08.11.1904 - 02.1908</li>
						<li>Ks. Teofil (Teophil) Schweda: 08.07.1905 - 01.12.1906</li>
						<li>Ks. Jan (Johannes) Ruta: 22.03.1907 - 11.05.1909</li>
						<li>Ks. Antoni (Anton) Wodarz: 25.02.1908 - 04.04.1916</li>
						<li>Ks. Henryk (Heinrich) Rduch: 24.05.1909 - 19.04.1910</li>
						<li>Ks. Wiktor Woźnicok (Woschnitzok): 25.10.1909 - 20.07.1910</li>
						<li>Ks. Artur (Arthur) Konda: 07.10.1910 - 28.10.1912</li>
						<li>Ks. Józef Karkosz (Josef Karkosch): 30.07.1910 - 07.10.1914</li>
						<li>Ks. Franciszek (Franz) Melzer: 23.09.1911 - 03.04.1913</li>
						<li>Ks. Wilhelm Hoppe: 28.10.1912 - 08.03.1915</li>
						<li>Ks. Karol (Carl) Wientzek: 18.09.1914 - 06.09.1916</li>
						<li>Bł. Ks. Elim Szramek: 12.09.1916 - 11.06.1917</li>
						<li>Ks. Alfons (Alphons) Januschewitz: 22.03.1915 - 27.11.1915</li>
						<li>Ks. Jan (Johannes) Grzonka: 15.11.1915 - 09.06.1922</li>
						<li>Ks. Teodor Moc (Theodor Motz): 21.03.1916 - 31.05.1917</li>
						<li>Ks. Paweł Wycisło: 25.05.1917 - 09.06.1922</li>
						<li>Ks. Alojzy Lazar: 25.05.1917 - 09.06.1922</li>
						<li>Ks. Antoni Korczok: 14.07.1922 - 04.04.1929</li>
						<li>Ks. Adrian Pilot: 14.07.1922 - 24.04.1927</li>
						<li>Ks. Józef Maruśka (Josef Maruska): 05.10.1922 - 09.07.1926</li>
						<li>Ks. Jan (Johannes) Smaczny: 14.10.1926 - 30.05.1928</li>
						<li>Ks. Karol Knosała (Carl Knossalla): 31.03.1927 - 26.04.1936</li>
						<li>Ks. Raimund Schypulla: 20.05.1928 - 05.11.1930</li>
						<li>Ks. Alferd Dudek: 03.04.1929 - 28.10.1929</li>
						<li>Ks. Franciszek Pieruszka (Pieruschka): 22.10.1929 - 11.07.1933</li>
						<li>Ks. Karol (Carl) Bujara: 22.10.1930 - 25.09.1941</li>
						<li>Ks. Alojzy (Alois) Zug: 01.07.1933 - 05.10.1936</li>
						<li>Ks. Alfred Langer: 26.04.1936 - 15.09.1937</li>
						<li>Ks. Karol (Carl) Rogier: 23.09.1936 - 15.09.1937</li>
						<li>Ks. Franciszek Dusza (Franz Dussa): 01.10.1937 - 14.02.1914</li>
						<li>Ks. Adolf Waloszek: 01.08.1938 - 28.08.1938</li>
						<li>Ks. Maksymilian (Maximilian) Zipfel: 28.08.1938 - 1941</li>
						<li>Ks. Erhard Bulla: 18.02.1941 - 1941</li>
						<li>Ks. Jerzy (Georg) Kühn: 27.09.1941 - 1942</li>
						<li>Ks. Gerhard Wagner: 19.08.1941 - 29.10.1946</li>
						<li>o. Josef Karduck MI: 02.04.1942 - 22.12.1943</li>
						<li>ks. Gerhard Jonczyk: 1943 - 1945</li>
						<li>Ks. Josef Hawellek: 17.04.1942 – 1945 (wikariusz-administrator)</li>
						<li>Ks. Jan Antoni Półchłopek: 11.10.1945 - 31.12.1946</li>
						<li>Ks. Alojzy Wycisk: 28.01.1947 - 31.12.1947</li>
						<li>Ks. Edmund Racki MSF: 28.06.1948 - 10.09.1949</li>
						<li>Ks. Stanisław Reńca: 20.09.1949 - 25.09.1956</li>
						<li>Ks. Jan Kania: 03.01.1951 - 31.12.1951</li>
						<li>Ks. Józef Łebek: 23.04.1951 - 14.07.1952</li>
						<li>Ks. Franciszek Grochut: 22.09.1950 - 22.09.1951</li>
						<li>Ks. Jan Taras: 11.07.1952 - 07.07.1955</li>
						<li>Ks. Eryk Jelitko: 14.07.1952 - 03.07.1954</li>
						<li>Ks. Tadeusz Kłak (Kłakowski): 11.07.1954 – 1955 (późniejszy prof. WSD Śląska Opolskiego)</li>
						<li>Ks. Stanisław Holeczek: 07.1955 - 01.12.1956</li>
						<li>Ks. Jan Świder: 21.07.1955 - 1956</li>
						<li>Ks. Bronisław Martyniak: 10.07.1956 - 18.11.1960</li>
						<li>Ks. Stefan Pieczka: 29.09.1956 - 03.11.1962</li>
						<li>Ks. Józef Grochol: 01.12.1956 - 07.12.1961</li>
						<li>Ks. Brunon Rehse: 18.11.1960 - 21.07.1966</li>
						<li>Ks. Damian Bryś: 07.12.1961 - 09.11.1964</li>
						<li>Ks. Józef Marfiany: 04.09.1962 - 21.11.1963</li>
						<li>Ks. Reinhold Klein: 06.09.1963 - 1966</li>
						<li>Ks. Eugeniusz Stercuła: 09.11.1964 - 21.07.1966</li>
						<li>Ks. Tadeusz Stonoga: 1965 - 21.10.1966</li>
						<li>Ks. Gustaw Kieshauer: 21.07.1966 - 19.07.1967</li>
						<li>Ks. Henryk Wieczorek: 21.07.1966 - 19.07.1967</li>
						<li>Ks. Ryszard Serafin: 21.10.1966 - 29.05.1972</li>
						<li>Ks. Rufin Grzesiek: 19.07.1967 - 04.07.1972</li>
						<li>Ks. Konrad Jeziorowski: 19.07.1967 - 17.05.1968</li>
						<li>Ks. Jan Kopiec: 17.06.1972 - 05.07.1974 (obecny Bp Gliwicki)</li>
						<li>Ks. Leopold Rychta: 04.07.1972 - 10.07.1974</li>
						<li>Ks. Zygmunt Lubieniecki: 21.07.1974 - 26.07.1976</li>
						<li>Ks. Rudolf Halemba: 05.07.1974 - 10.08.1976</li>
						<li>Ks. Michał Przyszlak: 26.07.1976 - 03.01.1977</li>
						<li>Ks. Kazimierz Świstek: 10.08.1976 - 01.08.1981</li>
						<li>Ks. Marian Wanke: 05.01.1977 - 13.08.1979</li>
						<li>Ks. Witold Szmigielski: 13.08.1979 - 17.06.1981</li>
						<li>Ks. Helmut Eckert: 06.06.1981 - 24.06.1983</li>
						<li>Ks. Józef Maślanka: 17.06.1981 - 25.08.194</li>
						<li>Ks. Jerzy Trinczek: 27.06.1983 - 27.08.1985</li>
						<li>Ks. Czesław Kocoń: 25.08.1984 - 25.08.1987</li>
						<li>Ks. Henryk Pasieka: 27.08.1985 - 27.08.1988</li>
						<li>Ks. Werner Olejnik: 25.08.1987 - 25.08.1991</li>
						<li>Ks. Karol Złoty: 28.08.1988 - 25.08.1991</li>
						<li>Ks. Zygmunt Perfecki: 25.08.1991 - 27.08.1995</li>
						<li>Ks. Artur Sepioło: 25.08.1991 - 16.07.2000</li>
						<li>Ks. Andrzej Iwanecki: 28.08.1995 - 27.08.1998 (późniejszy proboszcz oraz bp pomocniczy d. gliwickiej)</li>
						<li>Ks. Marek Olekszyk: 01.09.1998 - 15.08.2000</li>
						<li>Ks. Jarosław Steczkowski: 16.08.2000 - 01.09.2004</li>
						<li>Ks. Jarosław Buchenfeld: 16.08.2000 - 19.08.2006</li>
						<li>Ks. Paweł Macierzyński: 01.09.2004 - 01.09.2009</li>
						<li>Ks. Leszek Skorupa: 01.09.2006 - 30.08.2010</li>
						<li>Ks. Andrzej Staniek: 01.09.2008 - 01.09.2014</li>
						<li>Ks. Rafał Duda: 01.09.2009 - 01.09.2015</li>
						<li>Ks. Grzegorz Woźnica: 30.08.2010 - 01.09.2015</li>
						<li>Ks. Jacek Rauchut: 01.09.2014 - 01.09.2015</li>
						<li>Ks. Krzysztof Plewnia: 01.09.2015 - 01.09.2017</li>
						<li>Ks. Łukasz Krawiec: 01.09.2015 - 31.08.2020</li>
						<li>Ks. Piotr Golus: 01.09.2015 - 31.08.2021</li>
						<li>Ks. Zbigniew Śniechota: 01.09.2020 - aktualnie</li>
						<li>Ks. Piotr Sękowski: 01.09.2021 - 31.08.2022</li>
						<li>Ks. Tomasz Brol: 01.09.2022 - aktualnie</li>
					</ul>
				</div>
				<hr className="w-full my-7" />
			</MaxWidthWrapper>
		</main>
	);
}
