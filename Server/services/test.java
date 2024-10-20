// public class test{
//     public static void main(String[] args){
//         String str="abcbad";
//         int n=str.length();int flg=0;
//         for(int i=0;i<n/2;i++){
//             if(str.charAt(i)!=str.charAt(n-i-1)){
//                 flg=1;
//                 break;
//             }
//         }
//         if(flg==0){
//             System.out.println("It is apalindrome");
//         }
//         else{
//             System.out.println("It is not a palindrome");
//         }

//         Node curr=root;
//         Node Prev=null;
//         Node next=curr.next;
//         while(curr.next!=null){
//             curr.next=prev;
//             prev.next=curr;
//             curr.next=next;
//             if(next!=null){
//                 nex=next.next;
//             }
//         } 
//         return root;
//     }
// }