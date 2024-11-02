

<h1 class="heading-1 mt-4 mb-2">Documentation</h1>
<p class="text-muted-foreground">
    Small guide on how to get the best out of Squire.
</p>

<h3 class="heading-3 mt-4 mb-2">Core concepts</h3>
<p class="text-muted-foreground">Details on the main entities within Squire</p>
<h4 class="font-semibold text-lg mt-4">
    Products
</h4>
<p class="text-muted-foreground">
    Products are the main entity in Squire. 
    They represent a collection of repositories that are related to a specific topic within Github.
</p>

<h4 class="font-semibold text-lg mt-4">
    Repositories
</h4>
<p class="text-muted-foreground">
    Repositories are the individual Github repositories. 
    Adding a topic to a repository will allow Squire to look up the repository by topic, 
    then associate it with a product.
</p>

<h4 class="font-semibold text-lg mt-4">Security Advisories</h4>
<p class="text-muted-foreground">
    Security advisories are the security vulnerabilities that are found within the repositories.
    Squire will automatically scan the repositories for security vulnerabilities and display them on the dashboard.
</p>

<h3 class="heading-3 mt-4">Adding your first product</h3>

<p class="text-muted-foreground">
    When you first init your app, you will be prompted on the dashboard create a new product.
    Every product will have a unique name and a "tag" which is what squire will use to look up repositories by topic.
</p>

<h3 class="heading-3 mt-4">Data sync process</h3>
<p class="text-muted-foreground">
    Squire will run a background worker to sync all products every 1 minute.
</p>
    

<svelte:head>
    <title>Docs | Squire</title>
</svelte:head>