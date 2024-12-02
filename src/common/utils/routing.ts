import { useRouter, useRoute, type RouteLocationRaw } from "vue-router";



export default class RoutingUtils{

	static redirect(to: string){
		window.location.assign(to);
	}

	static async download(url: string, filename: string = "file"){
		const response = await fetch(url);
		if (!response.ok) 
			throw new Error("Network response was not ok");
		const blob = await response.blob();
		const downloadUrl = window.URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = downloadUrl;
		link.download = `${filename}.txt`; // use your desired file name here
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}

	static getUrlParams(){
		const router = useRoute();
		return router.query;
	}


	static createLink(content: string, type: string): string{
		const blob = new Blob([content], { type: `text/${type};charset=utf-8;` });
		const url = URL.createObjectURL(blob);
		return url;
	}

	static createAndOpen(content: string, type: string): string{
		const url = this.createLink(content, type);
		window.open(url, '_blank');
		return url;
	}

}