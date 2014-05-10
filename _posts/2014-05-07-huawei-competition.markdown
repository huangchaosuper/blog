---
layout: post
title: "第六届华为创新杯编程大赛-第二轮"
date: 2014-05-07 21:00:00
categories: life
tags: 竞赛
---

第六届华为创新杯编程大赛-第二轮 洞穴逃生 试题解答

##题目

洞穴逃生 

描述: 精灵王子爱好冒险，在一次探险历程中，他进入了一个神秘的山洞。在洞穴深处，精灵王子不小心触动了洞穴内暗藏的机关，整个洞穴将很快塌陷，精灵王子必须尽快逃离洞穴。精灵王子的跑步速度为17m/s，以这样的速度可能是无法逃出洞穴的。庆幸的是精灵王子拥有闪烁法术，可在1s内移动60m，不过每次使用闪烁法术都会消耗魔法值10点。精灵王子的魔法值恢复的速度为4点/s，只有处在原地休息状态时才能恢复。

现在已知精灵王子的魔法初值M，他所在洞穴中的位置与洞穴出口之间的距离S，距离洞穴塌陷的时间T。你的任务是写一个程序帮助精灵王子计算如何在最短的时间内逃离洞穴。若能逃出，输出"Yes"，并输出逃出所用的最短时间；若不能逃出，则输出"No"，同时输出精灵王子在剩下的时间内能走的最远距离。注意字母大小写。注意:精灵王子跑步、闪烁或休息活动均以秒(s)为单位。且每次活动的持续时间为整数秒。距离的单位为米(m)。

注：M、S、T均是大于等于0的整数。由输入保证取值合法性，考生不用检查。

提醒：

如果输入的S为0，则说明本身已经在出口，输出应为：Yes 0

如果输入的T为0（且S不为0），则说明已经没有时间了，输出应为：No 0

运行时间限制: 无限制 
内存限制: 无限制 

输入: 
	输入格式:M S T 

输出: 
	输出格式：
		Yes 逃出洞穴所用的最短时间
		或
		No 在洞穴塌陷前能逃跑的最远距离
 
样例输入: 10 50 5 

样例输出: Yes 1 

##解题思路

通过题目的分析，大家可以猜到此问题为最优化问题。

关键在于精灵王子的魔法值，那么思路就比较清晰了。

首先按照精灵王子的当前魔法值作为判断依据，在时间T为主要的干扰条件下，进行最优分析。当`T<=0`或`S<=0`作为分析终止条件。


##源代码（78分/100分）

{% highlight Java %}
/**
 * Created by huangchaosuper on 5/5/14.
 */
import com.sun.crypto.provider.TlsKeyMaterialGenerator;

import java.util.*;
public class Main {
    public static void main( String[] args ) {
        Scanner cin = new Scanner(System.in);
        Integer M = 0;//精灵王子的魔法初值M
        Integer S = 0;//所在洞穴中的位置与洞穴出口之间的距离S
        Integer T = 0;//距离洞穴塌陷的时间T
        String result = "Yes";//是否可以逃脱，True可以逃脱
        Integer resultTime = 0;
        Integer resultSpace = 0;
        if (cin.hasNext()){
            M = cin.nextInt();
            S = cin.nextInt();
            T = cin.nextInt();
            Integer t = T;
            Integer s = S;
            Integer m = M;
            if(S == 0 ){
                System.out.printf("%s %d\n", result, resultTime);
            }else if (T == 0){
                result = "No";
                System.out.printf("%s %d\n",result,resultSpace);
            }else{
                while(T>0&&S>0) {
                    if(M>=10){
                        S = S-60;
                        M = M-10;
                    }else if (M<10&&M>=6){
                        if(S>17){
                            M = M+4;
                        }else{
                            S = S - 17;
                        }
                    }else if (M<6&&M>=2){
                        if(S>34&&T>=2){
                            M = M+4;
                        }else {
                            S = S - 17;
                        }
                    }else if (M<2){
                        if(S>51&&T>=3){
                            M = M+4;
                        }else {
                            S = S - 17;
                        }
                    }
                    T--;
                }
                if(T>0||(T==0&&S<=0)){
                    result = "Yes";
                    resultTime = t-T;
                    System.out.printf("%s %d\n",result,resultTime);
                }else{
                    result = "No";
                    resultSpace = s-S;
                    System.out.printf("%s %d\n",result,resultSpace);
                }
            }
        }
    }
}
{% endhighlight %}


##吐槽

感觉华为的这次比赛完全变成吐槽比赛了。以上代码比赛结束后，笔者便没有做任何修改，大家就不要吐槽我的代码了。

笔者的比赛时间是10：00开始，可悲的是当我睁开眼睛的时候已经10：15了，好吧，我承认一个半小时的比赛，我只用了70分钟，这也不能怪别人，谁让你起来晚了呢。还好不是11：15睁开的眼睛，说起来有点后怕。呵呵

由于有了第一轮比赛卡网页的经验，这次笔者在提前7分钟的时候，果断选择提交代码。不料，点击提交按钮的时候竟然跳转到登陆页面了。顿时整个人都感觉不太好了。马上整理了一下心情，开始重新登录，不出所料，卡机ing。幸运的是，最终超时8分钟才提交成功，而且被判成绩有效。期间笔者是各种微博吐槽。不过@华为组织者，态度还是蛮好的。


##后记

以78分杀入进阶赛最后一轮。期待进入全国前48强，决战成渝，决赛PK。