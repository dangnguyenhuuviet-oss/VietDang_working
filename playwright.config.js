import {defineConfig} from '@playwright/test';
import {existsSync} from 'node:fs';
export default defineConfig({testDir:'./tests',testMatch:'**/*.spec.js',use:{headless:true,launchOptions:existsSync('/usr/bin/chromium')?{executablePath:'/usr/bin/chromium',args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']}:{}},workers:1});
