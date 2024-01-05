export default class ToastUtils{

    static toast(componet: any, message: string, duration=5000){
        const toast = componet.$toast.open({
            message: message
        });
        setTimeout(() => {
            toast.dismiss();
        }, duration);
    }

}